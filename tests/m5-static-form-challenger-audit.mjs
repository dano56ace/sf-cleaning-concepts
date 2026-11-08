import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(PROJECT_ROOT, 'dist');

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║  M5 Static HTML Form & Attribute Challenger Audit Suite                   ║');
console.log('║  Adversarial Verification of Netlify Forms Across All Prerendered Routes   ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

// 1. Recursive file finder for all HTML files in dist/
function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

// 2. Canonical 86 Routes Definition
const CORE_ROUTES = [
  '/',
  '/about-us',
  '/our-services',
  '/contact-us',
  '/faqs',
  '/our-publications'
];

const SERVICE_ROUTES = [
  '/service',
  '/service/office-cleaning',
  '/service/medical-office-cleaning',
  '/service/bars-and-restaurant-cleaning',
  '/service/short-term-rentals',
  '/service/post-construction-cleaning',
  '/service/move-in-out-cleaning',
  '/service/home-maintenance',
  '/service/school-cleaning',
  '/service/home-watching',
  '/service/covid-19-disinfection'
];

const BLOG_ROUTES = [
  '/blog/revitalize-your-office-space',
  '/blog/complete-guide-to-home-cleaning',
  '/blog/restaurant-and-bar-cleaning-services',
  '/blog/office-cleaning-made-easy',
  '/blog/short-term-rental-cleaning-guide',
  '/blog/high-quality-cleaning-services-south-florida',
  '/blog/medical-office-cleaning-guide',
  '/blog/deep-cleaning-for-homes-and-offices',
  '/blog/post-construction-cleaning-guide',
  '/blog/south-florida-home-maintenance-services',
  '/blog/residential-cleaning-services-journey'
];

const DIRECTORY_ROUTE = '/service-areas';

// Read service areas from source
const serviceAreasSrc = fs.readFileSync(path.join(PROJECT_ROOT, 'src/data/serviceAreas.ts'), 'utf-8');
const slugMatches = [...serviceAreasSrc.matchAll(/"?slug"?:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
const uniqueSlugs = [...new Set(slugMatches)];
const SERVICE_AREA_ROUTES = uniqueSlugs.map(slug => `/service-area/${slug}`);

const ERROR_ROUTE = '/404';

const ALL_86_CANONICAL_ROUTES = [
  ...CORE_ROUTES,
  ...SERVICE_ROUTES,
  ...BLOG_ROUTES,
  DIRECTORY_ROUTE,
  ...SERVICE_AREA_ROUTES,
  ERROR_ROUTE
];

console.log(`[Census] Identified ${ALL_86_CANONICAL_ROUTES.length} canonical routes:`);
console.log(`  - Core routes: ${CORE_ROUTES.length}`);
console.log(`  - Service routes: ${SERVICE_ROUTES.length}`);
console.log(`  - Blog routes: ${BLOG_ROUTES.length}`);
console.log(`  - Service Area Directory: 1`);
console.log(`  - Localized Service Area routes: ${SERVICE_AREA_ROUTES.length}`);
console.log(`  - Error route (404): 1\n`);

if (ALL_86_CANONICAL_ROUTES.length !== 86) {
  console.error(`[ERROR] Expected 86 canonical routes, but calculated ${ALL_86_CANONICAL_ROUTES.length}`);
  process.exit(1);
}

// 3. Form extraction and verification logic
function parseFormTags(html) {
  const formRegex = /<form\b([\s\S]*?)>([\s\S]*?)<\/form>/gi;
  const forms = [];
  let match;
  while ((match = formRegex.exec(html)) !== null) {
    const rawAttrs = match[1];
    const innerHtml = match[2];

    const getAttr = (name) => {
      const attrRegex = new RegExp(`(?:^|\\s)${name}(?:=["']([^"']*)["']|(?=[\\s>]|$))`, 'i');
      const m = rawAttrs.match(attrRegex);
      if (!m) return null;
      return m[1] !== undefined ? m[1] : 'true';
    };

    // Extract input, textarea, select controls
    const inputRegex = /<(input|textarea|select)\b([^>]*?)>/gi;
    const inputs = [];
    let inMatch;
    while ((inMatch = inputRegex.exec(innerHtml)) !== null) {
      const tag = inMatch[1].toLowerCase();
      const inAttrs = inMatch[2];
      const getName = (name) => {
        const m2 = inAttrs.match(new RegExp(`(?:^|\\s)${name}=["']([^"']*)["']`, 'i'));
        return m2 ? m2[1] : null;
      };
      inputs.push({
        tag,
        name: getName('name'),
        type: getName('type') || (tag === 'textarea' ? 'textarea' : 'text'),
        value: getName('value'),
        raw: inMatch[0]
      });
    }

    forms.push({
      id: getAttr('id'),
      name: getAttr('name'),
      method: getAttr('method') || 'GET',
      action: getAttr('action'),
      dataNetlify: getAttr('data-netlify'),
      netlify: getAttr('netlify'),
      dataNetlifyHoneypot: getAttr('data-netlify-honeypot'),
      netlifyHoneypot: getAttr('netlify-honeypot'),
      hidden: getAttr('hidden'),
      style: getAttr('style'),
      ariaHidden: getAttr('aria-hidden'),
      rawAttrs,
      innerHtml,
      inputs
    });
  }
  return forms;
}

// Check Netlify static form requirements on a given form
const REQUIRED_7_FIELDS = ['form-name', 'bot-field', 'name', 'email', 'phone', 'message', 'source'];

function evaluateStaticNetlifyForm(form, filePath) {
  const issues = [];

  if (form.name !== 'quote-request') {
    issues.push(`Form name is '${form.name}', expected 'quote-request'`);
  }

  const methodUpper = (form.method || '').toUpperCase();
  if (methodUpper !== 'POST') {
    issues.push(`Form method is '${form.method}', expected 'POST'`);
  }

  if (form.dataNetlify !== 'true' && form.netlify !== 'true') {
    issues.push(`Missing data-netlify="true" or netlify attribute`);
  }

  if (form.dataNetlifyHoneypot !== 'bot-field' && form.netlifyHoneypot !== 'bot-field') {
    issues.push(`Missing data-netlify-honeypot="bot-field" (found: ${form.dataNetlifyHoneypot || 'none'})`);
  }

  // Check honeypot attribute parity: both data-netlify-honeypot and netlify-honeypot
  if (form.dataNetlifyHoneypot !== 'bot-field') {
    issues.push(`data-netlify-honeypot is not 'bot-field'`);
  }
  if (form.netlifyHoneypot !== 'bot-field') {
    issues.push(`netlify-honeypot is not 'bot-field'`);
  }

  // Check all 7 input fields
  const inputNames = form.inputs.map(i => i.name).filter(Boolean);
  for (const field of REQUIRED_7_FIELDS) {
    if (!inputNames.includes(field)) {
      issues.push(`Missing required field '${field}'. Present fields: [${inputNames.join(', ')}]`);
    }
  }

  // Check hidden form-name value
  const formNameField = form.inputs.find(i => i.name === 'form-name');
  if (!formNameField || formNameField.value !== 'quote-request') {
    issues.push(`Field 'form-name' value is '${formNameField ? formNameField.value : 'missing'}', expected 'quote-request'`);
  }

  return {
    valid: issues.length === 0,
    issues,
    inputNames
  };
}

// 4. Execution: Scan 100% of HTML files in dist/
console.log('--- Step 1: Scan Every .html File in dist/ ---');
const allHtmlFiles = getAllHtmlFiles(DIST_DIR);
console.log(`Found ${allHtmlFiles.length} total .html files in ${DIST_DIR}`);

let totalFilesChecked = 0;
let filesWithValidStaticForm = 0;
const fileFailures = [];

for (const filePath of allHtmlFiles) {
  totalFilesChecked++;
  const relPath = path.relative(PROJECT_ROOT, filePath);
  const html = fs.readFileSync(filePath, 'utf-8');
  const forms = parseFormTags(html);

  // Find the static hidden form name="quote-request"
  const staticForm = forms.find(f => f.name === 'quote-request' && (f.hidden !== null || (f.style && f.style.includes('display: none'))));

  if (!staticForm) {
    fileFailures.push({
      file: relPath,
      reason: 'No hidden static form named "quote-request" found'
    });
    continue;
  }

  const evalResult = evaluateStaticNetlifyForm(staticForm, relPath);
  if (!evalResult.valid) {
    fileFailures.push({
      file: relPath,
      reason: evalResult.issues.join('; ')
    });
  } else {
    filesWithValidStaticForm++;
  }
}

console.log(`Files checked: ${totalFilesChecked}`);
console.log(`Files with valid static Netlify form: ${filesWithValidStaticForm}`);
console.log(`Files failed: ${fileFailures.length}`);

if (fileFailures.length > 0) {
  console.error('\n[FAILURES IN HTML FILES]:');
  fileFailures.slice(0, 10).forEach(f => console.error(`  - ${f.file}: ${f.reason}`));
} else {
  console.log('✓ 100% of HTML files in dist/ contain valid static Netlify form registration!\n');
}

// 5. Step 2: Route Coverage Verification Across ALL 86 Canonical Routes
console.log('--- Step 2: Canonical 86 Route Coverage & Zero Missing Routes ---');
let routesChecked = 0;
let routesPassed = 0;
const routeFailures = [];

for (const route of ALL_86_CANONICAL_ROUTES) {
  routesChecked++;
  const clean = route.replace(/^\/+|\/+$/g, '');
  
  // Routes should have either dist/<clean>/index.html or dist/<clean>.html (or dist/index.html for '/')
  const indexHtmlPath = clean ? path.join(DIST_DIR, clean, 'index.html') : path.join(DIST_DIR, 'index.html');
  const flatHtmlPath = clean ? path.join(DIST_DIR, `${clean}.html`) : path.join(DIST_DIR, 'index.html');

  const indexExists = fs.existsSync(indexHtmlPath);
  const flatExists = fs.existsSync(flatHtmlPath);

  if (!indexExists && !flatExists) {
    routeFailures.push({
      route,
      reason: `Neither ${path.relative(PROJECT_ROOT, indexHtmlPath)} nor ${path.relative(PROJECT_ROOT, flatHtmlPath)} exists on disk`
    });
    continue;
  }

  // Check both files if both exist, otherwise check existing
  const filesToVerify = [];
  if (indexExists) filesToVerify.push(indexHtmlPath);
  if (flatExists && flatHtmlPath !== indexHtmlPath) filesToVerify.push(flatHtmlPath);

  let routeValid = true;
  for (const fPath of filesToVerify) {
    const html = fs.readFileSync(fPath, 'utf-8');
    const forms = parseFormTags(html);
    const staticForm = forms.find(f => f.name === 'quote-request' && (f.hidden !== null || (f.style && f.style.includes('display: none'))));
    if (!staticForm) {
      routeFailures.push({
        route,
        file: path.relative(PROJECT_ROOT, fPath),
        reason: 'Static quote-request form missing'
      });
      routeValid = false;
      break;
    }
    const evalRes = evaluateStaticNetlifyForm(staticForm, fPath);
    if (!evalRes.valid) {
      routeFailures.push({
        route,
        file: path.relative(PROJECT_ROOT, fPath),
        reason: evalRes.issues.join('; ')
      });
      routeValid = false;
      break;
    }
  }

  if (routeValid) {
    routesPassed++;
  }
}

console.log(`Canonical routes checked: ${routesChecked} / 86`);
console.log(`Canonical routes passed: ${routesPassed} / 86`);
console.log(`Routes missing or failing: ${routeFailures.length}`);

if (routeFailures.length > 0) {
  console.error('\n[ROUTE COVERAGE FAILURES]:');
  routeFailures.forEach(r => console.error(`  - ${r.route} (${r.file}): ${r.reason}`));
} else {
  console.log('✓ EXACTLY 0 routes lack valid Netlify form registration across all 86 routes!\n');
}

// 6. Step 3: Check dist/contact-us.html and dist/contact-us/index.html for #lead-quote-form
console.log('--- Step 3: Verification of #lead-quote-form in Contact Pages ---');
const contactFiles = [
  path.join(DIST_DIR, 'contact-us.html'),
  path.join(DIST_DIR, 'contact-us/index.html'),
  path.join(DIST_DIR, 'contact.html'),
  path.join(DIST_DIR, 'contact/index.html')
];

const contactResults = [];
for (const cFile of contactFiles) {
  const rel = path.relative(PROJECT_ROOT, cFile);
  if (!fs.existsSync(cFile)) {
    contactResults.push({ file: rel, exists: false, error: 'File does not exist' });
    continue;
  }

  const html = fs.readFileSync(cFile, 'utf-8');
  const forms = parseFormTags(html);
  const leadForm = forms.find(f => f.id === 'lead-quote-form');

  if (!leadForm) {
    contactResults.push({ file: rel, exists: true, error: '#lead-quote-form element not found' });
    continue;
  }

  const issues = [];
  if (leadForm.name !== 'quote-request') issues.push(`name is '${leadForm.name}', expected 'quote-request'`);
  if ((leadForm.method || '').toUpperCase() !== 'POST') issues.push(`method is '${leadForm.method}', expected 'POST'`);
  if (leadForm.action !== '/') issues.push(`action is '${leadForm.action}', expected '/'`);
  if (leadForm.dataNetlify !== 'true' && leadForm.netlify !== 'true') issues.push('missing data-netlify="true"');
  if (leadForm.dataNetlifyHoneypot !== 'bot-field') issues.push(`data-netlify-honeypot is '${leadForm.dataNetlifyHoneypot}', expected 'bot-field'`);
  if (leadForm.netlifyHoneypot !== 'bot-field') issues.push(`netlify-honeypot is '${leadForm.netlifyHoneypot}', expected 'bot-field'`);

  // Check hidden source input
  const sourceInput = leadForm.inputs.find(i => i.name === 'source');
  if (!sourceInput) {
    issues.push('missing input with name="source"');
  } else if (sourceInput.type !== 'hidden') {
    issues.push(`source input type is '${sourceInput.type}', expected 'hidden'`);
  } else if (!sourceInput.value) {
    issues.push('source input value is empty');
  }

  // Check bot-field honeypot
  const botFieldInput = leadForm.inputs.find(i => i.name === 'bot-field');
  if (!botFieldInput) {
    issues.push('missing honeypot input with name="bot-field"');
  }

  // Check hidden form-name
  const formNameInput = leadForm.inputs.find(i => i.name === 'form-name');
  if (!formNameInput || formNameInput.value !== 'quote-request') {
    issues.push(`form-name input is '${formNameInput ? formNameInput.value : 'missing'}', expected 'quote-request'`);
  }

  // Check user fields
  const hasName = leadForm.inputs.some(i => i.name === 'name');
  const hasEmail = leadForm.inputs.some(i => i.name === 'email');
  const hasPhone = leadForm.inputs.some(i => i.name === 'phone');
  if (!hasName) issues.push('missing name input');
  if (!hasEmail) issues.push('missing email input');
  if (!hasPhone) issues.push('missing phone input');

  contactResults.push({
    file: rel,
    exists: true,
    leadFormFound: true,
    leadFormName: leadForm.name,
    sourceValue: sourceInput ? sourceInput.value : null,
    valid: issues.length === 0,
    issues,
    inputs: leadForm.inputs.map(i => `${i.name} (${i.type}${i.value ? `=${i.value}` : ''})`)
  });
}

contactResults.forEach(cr => {
  if (cr.valid) {
    console.log(`✓ ${cr.file}: #lead-quote-form present, valid Netlify attributes, honeypot="bot-field", source="${cr.sourceValue}"`);
  } else {
    console.error(`✗ ${cr.file}: ${cr.issues ? cr.issues.join(', ') : cr.error}`);
  }
});

// 7. Step 4: Adversarial Stress-Tests & Boundary Conditions
console.log('\n--- Step 4: Adversarial Stress Tests & Boundary Conditions ---');

// Stress Test A: Verify field name uniqueness inside quote-request static form
let duplicateFieldCount = 0;
for (const filePath of allHtmlFiles) {
  const html = fs.readFileSync(filePath, 'utf-8');
  const forms = parseFormTags(html);
  const staticForm = forms.find(f => f.name === 'quote-request' && (f.hidden !== null || (f.style && f.style.includes('display: none'))));
  if (staticForm) {
    const names = staticForm.inputs.map(i => i.name).filter(Boolean);
    const uniqueNames = new Set(names);
    if (uniqueNames.size !== names.length) {
      duplicateFieldCount++;
    }
  }
}
console.log(`Stress Test A (Field Name Uniqueness): ${duplicateFieldCount === 0 ? 'PASS (0 duplicate field definitions)' : `FAIL (${duplicateFieldCount} files have duplicates)`}`);

// Stress Test B: Verify honeypot bot trap in QuoteForm.tsx
const quoteFormSrc = fs.readFileSync(path.join(PROJECT_ROOT, 'src/components/ui/QuoteForm.tsx'), 'utf-8');
const hasBotTrapCheck = /if\s*\(\s*formData\.botField\s*\)/.test(quoteFormSrc);
const hasPayloadAppend = /payload\.append\(['"]bot-field['"],\s*formData\.botField\)/.test(quoteFormSrc);
const hasDisabledInputs = quoteFormSrc.includes('disabled={isSubmitting}');
const hasErrorGuard = /if\s*\(\s*!response\.ok\s*\)/.test(quoteFormSrc);
const hasCatchHandling = /catch\s*\((?:err|error|e)/.test(quoteFormSrc) && quoteFormSrc.includes('setSubmitError');

console.log(`Stress Test B (QuoteForm.tsx Bot Trap Check): ${hasBotTrapCheck ? 'PASS' : 'FAIL'}`);
console.log(`Stress Test C (QuoteForm.tsx Payload Honeypot Append): ${hasPayloadAppend ? 'PASS' : 'FAIL'}`);
console.log(`Stress Test D (QuoteForm.tsx Double-Submit Disabled Guard): ${hasDisabledInputs ? 'PASS' : 'FAIL'}`);
console.log(`Stress Test E (QuoteForm.tsx HTTP Response Ok Error Guard): ${hasErrorGuard ? 'PASS' : 'FAIL'}`);
console.log(`Stress Test F (QuoteForm.tsx Error Alert State Preservation): ${hasCatchHandling ? 'PASS' : 'FAIL'}`);

// Output summary object
const summary = {
  timestamp: new Date().toISOString(),
  totalHtmlFiles: allHtmlFiles.length,
  totalFilesChecked,
  filesWithValidStaticForm,
  fileFailuresCount: fileFailures.length,
  canonicalRoutesCount: ALL_86_CANONICAL_ROUTES.length,
  routesPassed,
  routesFailingCount: routeFailures.length,
  contactResults,
  stressTests: {
    duplicateFields: duplicateFieldCount,
    hasBotTrapCheck,
    hasPayloadAppend,
    hasDisabledInputs,
    hasErrorGuard,
    hasCatchHandling
  },
  verdict: (fileFailures.length === 0 && routeFailures.length === 0 && contactResults.every(c => c.valid) && duplicateFieldCount === 0 && hasBotTrapCheck && hasErrorGuard) ? 'APPROVE' : 'REQUEST_CHANGES'
};

fs.writeFileSync(path.join(PROJECT_ROOT, 'tests/m5-challenger-test-results.json'), JSON.stringify(summary, null, 2), 'utf-8');
console.log(`\n======================================================`);
console.log(`AUDIT COMPLETE. VERDICT: ${summary.verdict}`);
console.log(`Detailed results written to tests/m5-challenger-test-results.json`);
console.log(`======================================================\n`);

if (summary.verdict !== 'APPROVE') {
  process.exit(1);
}
