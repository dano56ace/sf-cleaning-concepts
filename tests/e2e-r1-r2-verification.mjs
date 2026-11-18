#!/usr/bin/env node
/**
 * Opaque-Box 4-Tier E2E Verification Suite
 * Project: South Florida Cleaning Concepts (R1 Scroll + R2 Copy Condensation & SEO)
 *
 * Usage:
 *   node tests/e2e-r1-r2-verification.mjs [--tier=1|2|3|4|all] [--json] [--out <path>]
 *
 * Exit codes:
 *   0 = All executed requirement checks passed
 *   1 = One or more requirement checks failed
 *   2 = Fatal harness/infrastructure error (missing dist/, Chrome launch failure, invalid args)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startStaticServer } from './e2e-r1-r2/server.mjs';
import { launchChrome } from './e2e-r1-r2/cdp.mjs';
import {
  analyzeDist,
  runStaticTier1Checks,
  runStaticTier2Checks,
} from './e2e-r1-r2/static-checks.mjs';
import { runBrowserChecks } from './e2e-r1-r2/browser-checks.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

function parseArgs(argv) {
  let tierArg = 'all';
  let jsonOutput = false;
  let outPath = null;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') {
      jsonOutput = true;
    } else if (arg.startsWith('--tier=')) {
      tierArg = arg.slice('--tier='.length).trim();
    } else if (arg === '--tier' && i + 1 < argv.length) {
      tierArg = argv[++i].trim();
    } else if (arg.startsWith('--out=')) {
      outPath = arg.slice('--out='.length).trim();
    } else if (arg === '--out' && i + 1 < argv.length) {
      outPath = argv[++i].trim();
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: node tests/e2e-r1-r2-verification.mjs [--tier=1|2|3|4|all] [--json] [--out <path>]');
      process.exit(0);
    } else {
      throw new Error(`Unknown CLI argument: ${arg}`);
    }
  }

  let tiers;
  if (tierArg === 'all') {
    tiers = [1, 2, 3, 4];
  } else {
    tiers = tierArg.split(',').map((t) => Number.parseInt(t.trim(), 10));
    if (tiers.some((t) => ![1, 2, 3, 4].includes(t))) {
      throw new Error(`Invalid --tier value "${tierArg}". Expected 1, 2, 3, 4, or all.`);
    }
  }

  return { tiers: [...new Set(tiers)].sort(), jsonOutput, outPath };
}

function summarizeResults(results, tiers, durationMs) {
  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  const byTier = {};
  for (const t of tiers) {
    const sub = results.filter((r) => r.tier === t);
    byTier[`tier${t}`] = {
      total: sub.length,
      passed: sub.filter((r) => r.passed).length,
      failed: sub.filter((r) => !r.passed).length,
    };
  }
  const byArea = {};
  for (const r of results) {
    if (!byArea[r.area]) byArea[r.area] = { total: 0, passed: 0, failed: 0 };
    byArea[r.area].total++;
    if (r.passed) byArea[r.area].passed++;
    else byArea[r.area].failed++;
  }

  return {
    timestamp: new Date().toISOString(),
    distDir: DIST_DIR,
    tiersExecuted: tiers,
    durationMs,
    total: results.length,
    passed,
    failed,
    byTier,
    byArea,
    results,
  };
}

function printHumanSummary(report) {
  console.log('======================================================================');
  console.log('  SOUTH FLORIDA CLEANING CONCEPTS — 4-TIER E2E VERIFICATION (R1 + R2)');
  console.log('======================================================================');
  console.log(`Tiers: ${report.tiersExecuted.join(', ')} | Duration: ${(report.durationMs / 1000).toFixed(2)}s`);
  console.log('');

  for (const t of report.tiersExecuted) {
    const tierResults = report.results.filter((r) => r.tier === t);
    const tierStats = report.byTier[`tier${t}`];
    console.log(`--- Tier ${t} (${tierStats.passed}/${tierStats.total} passed) ---`);
    for (const r of tierResults) {
      const icon = r.passed ? 'PASS' : 'FAIL';
      console.log(`  [${icon}] ${r.id} (${r.area}) — ${r.name}`);
      if (!r.passed || process.env.VERBOSE === '1') {
        console.log(`         -> ${r.details}`);
      }
    }
    console.log('');
  }

  console.log('--- Summary by Feature Area ---');
  for (const [area, s] of Object.entries(report.byArea)) {
    console.log(`  ${area}: ${s.passed}/${s.total} passed`);
  }
  console.log('----------------------------------------------------------------------');
  console.log(`OVERALL: ${report.passed}/${report.total} passed, ${report.failed} failed`);
  console.log('======================================================================');
}

async function main() {
  const startedAt = Date.now();
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`FATAL (args): ${err.message}`);
    process.exit(2);
  }

  if (!fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    console.error(`FATAL: Built dist/ not found at ${DIST_DIR}. Run "npm run build" first.`);
    process.exit(2);
  }

  let serverHandle = null;
  let cdpClient = null;
  let pendingChromeHandle = null;
  let cleaningUp = false;

  const cleanup = async () => {
    if (cleaningUp) return;
    cleaningUp = true;
    if (cdpClient) {
      await cdpClient.close().catch(() => {});
      cdpClient = null;
    } else if (pendingChromeHandle) {
      await pendingChromeHandle.close().catch(() => {});
    }
    pendingChromeHandle = null;
    if (serverHandle) {
      await serverHandle.close().catch(() => {});
      serverHandle = null;
    }
  };

  const onSignal = (sig) => {
    cleanup().finally(() => {
      process.stderr.write(`\nInterrupted by ${sig}, cleaned up server & Chrome.\n`);
      process.exit(2);
    });
  };
  process.once('SIGINT', () => onSignal('SIGINT'));
  process.once('SIGTERM', () => onSignal('SIGTERM'));

  try {
    serverHandle = await startStaticServer(DIST_DIR);
    cdpClient = await launchChrome({
      onSpawn: (handle) => {
        pendingChromeHandle = handle;
      },
    });
    pendingChromeHandle = null;

    const distAnalysis = analyzeDist(DIST_DIR);
    const results = [];

    if (args.tiers.includes(1)) {
      results.push(...runStaticTier1Checks(distAnalysis));
    }
    if (args.tiers.includes(2)) {
      results.push(...(await runStaticTier2Checks(distAnalysis, serverHandle.baseUrl)));
    }

    results.push(
      ...(await runBrowserChecks({
        cdp: cdpClient,
        baseUrl: serverHandle.baseUrl,
        tiers: args.tiers,
      }))
    );

    const report = summarizeResults(results, args.tiers, Date.now() - startedAt);

    if (args.outPath) {
      const resolvedOut = path.resolve(process.cwd(), args.outPath);
      fs.mkdirSync(path.dirname(resolvedOut), { recursive: true });
      fs.writeFileSync(resolvedOut, JSON.stringify(report, null, 2) + '\n', 'utf8');
    }

    if (args.jsonOutput) {
      process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    } else {
      printHumanSummary(report);
    }

    await cleanup();
    process.exit(report.failed > 0 ? 1 : 0);
  } catch (err) {
    await cleanup();
    console.error(`FATAL (harness): ${err?.stack || err?.message || String(err)}`);
    process.exit(2);
  }
}

main();
