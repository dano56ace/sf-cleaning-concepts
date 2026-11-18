import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.mp4': 'video/mp4',
};

function parseRedirects(redirectsPath) {
  const rules = new Map();
  if (!fs.existsSync(redirectsPath)) return rules;
  const raw = fs.readFileSync(redirectsPath, 'utf8');
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 3) continue;
    const [from, to, codeToken] = parts;
    if (!from.startsWith('/') || from.includes('*')) continue;
    const code = Number.parseInt(codeToken.replace('!', ''), 10);
    if (code === 301 || code === 302) {
      const normalizedFrom = from.length > 1 ? from.replace(/\/+$/, '') : from;
      rules.set(from, { to, code });
      rules.set(normalizedFrom, { to, code });
      rules.set(`${normalizedFrom}/`, { to, code });
    }
  }
  return rules;
}

export async function startStaticServer(distDir) {
  const resolvedDist = path.resolve(distDir);
  const indexFile = path.join(resolvedDist, 'index.html');
  const notFoundFile = path.join(resolvedDist, '404.html');

  if (!fs.existsSync(indexFile)) {
    throw new Error(`Missing built dist/index.html at ${indexFile}. Run "npm run build" first.`);
  }

  const redirects = parseRedirects(path.join(resolvedDist, '_redirects'));

  const server = http.createServer((req, res) => {
    try {
      const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
      let pathname = decodeURIComponent(reqUrl.pathname);

      // Simulate Netlify form / function POST endpoints cleanly if exercised
      if (req.method === 'POST') {
        req.resume();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true }));
        return;
      }

      // 1. Exact/normalized _redirects 301 rules (legacy WP slugs & /contact)
      const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
      const redirectRule = redirects.get(pathname) || redirects.get(normalized);
      if (redirectRule) {
        const location = redirectRule.to + (reqUrl.search || '');
        res.writeHead(redirectRule.code, { Location: location });
        res.end();
        return;
      }

      // Guard path traversal
      const safeRelative = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, '');
      let filePath = null;
      let statusCode = 200;

      if (pathname === '/') {
        filePath = indexFile;
      } else {
        const candidate = path.join(resolvedDist, safeRelative.replace(/^\/+/, ''));
        if (candidate !== resolvedDist && !candidate.startsWith(resolvedDist + path.sep)) {
          statusCode = 404;
        } else if (fs.existsSync(candidate)) {
          const st = fs.statSync(candidate);
          if (st.isDirectory()) {
            const dirIndex = path.join(candidate, 'index.html');
            if (fs.existsSync(dirIndex) && fs.statSync(dirIndex).isFile()) {
              filePath = dirIndex;
            }
          } else if (st.isFile()) {
            filePath = candidate;
          }
        }

        // Clean URL .html fallback (e.g. /our-services -> dist/our-services.html if dir absent)
        if (!filePath && !pathname.endsWith('/')) {
          const htmlFallback = `${candidate}.html`;
          if (
            htmlFallback.startsWith(resolvedDist + path.sep) &&
            fs.existsSync(htmlFallback) &&
            fs.statSync(htmlFallback).isFile()
          ) {
            filePath = htmlFallback;
          }
        }
      }

      if (!filePath) {
        statusCode = 404;
        filePath = fs.existsSync(notFoundFile) ? notFoundFile : null;
      }

      if (!filePath) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const stat = fs.statSync(filePath);

      // Handle byte-range requests for MP4 videos
      const rangeHeader = req.headers.range;
      if (rangeHeader && statusCode === 200) {
        const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
        if (match) {
          const start = match[1] ? Number.parseInt(match[1], 10) : 0;
          const end = match[2] ? Math.min(Number.parseInt(match[2], 10), stat.size - 1) : stat.size - 1;
          if (start >= 0 && start <= end && end < stat.size) {
            res.writeHead(206, {
              'Content-Type': contentType,
              'Content-Range': `bytes ${start}-${end}/${stat.size}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': String(end - start + 1),
              'Cache-Control': 'no-store',
            });
            if (req.method === 'HEAD') {
              res.end();
              return;
            }
            fs.createReadStream(filePath, { start, end }).pipe(res);
            return;
          }
        }
      }

      res.writeHead(statusCode, {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store',
      });
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(String(err));
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      resolve();
    });
  });

  const addr = server.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  const baseUrl = `http://127.0.0.1:${port}`;

  return {
    server,
    port,
    baseUrl,
    redirects,
    async close() {
      server.closeAllConnections?.();
      await new Promise((resolve) => server.close(() => resolve()));
    },
  };
}
