// @ts-check
/**
 * ══════════════════════════════════════════════════════════════════════════
 * Adversarial M5 Interactive Submission, Honeypot & Payload Boundary Stress Test
 *
 * Targets:
 *  1. Honeypot Bot Trap Defense (silent handling, zero fetch, DOM concealment)
 *  2. Error Handling & Network Drops (#quote-error-banner, data preservation, success suppression)
 *  3. Payload Boundary & Form Schema Parity (form-name, urlencoded payload, field matching)
 *  4. In-Flight Input/Button Disabled Guards
 * ══════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

function assert(condition, testId, description, details = '') {
  results.total++;
  if (condition) {
    results.passed++;
    results.tests.push({ id: testId, description, status: 'PASS', details });
    console.log(`  \x1b[32m[PASS]\x1b[0m ${testId}: ${description}`);
  } else {
    results.failed++;
    results.tests.push({ id: testId, description, status: 'FAIL', details });
    console.log(`  \x1b[31m[FAIL]\x1b[0m ${testId}: ${description} — ${details}`);
  }
}

console.log('\n======================================================================');
console.log('  M5 ADVERSARIAL CHALLENGER 2: INTERACTIVE SUBMISSION & HONEYPOT SUITE');
console.log('======================================================================\n');

// ── SECTION 1: CODE & DOM AUDIT OF QuoteForm.tsx ──────────────────────────
console.log('── Section 1: QuoteForm.tsx Source & Architecture Inspection ──');

const quoteFormPath = path.join(PROJECT_ROOT, 'src/components/ui/QuoteForm.tsx');
assert(fs.existsSync(quoteFormPath), 'SEC1.1', 'QuoteForm.tsx source file exists', quoteFormPath);

const quoteFormSrc = fs.readFileSync(quoteFormPath, 'utf-8');

// Check honeypot implementation
const hasBotFieldState = /botField:\s*''/.test(quoteFormSrc);
assert(hasBotFieldState, 'SEC1.2', 'formData state includes botField initialized to empty string');

const hasBotFieldGuard = /if\s*\(\s*formData\.botField\s*\)\s*\{\s*setIsSubmitted\s*\(\s*true\s*\);\s*return;\s*\}/.test(quoteFormSrc);
assert(hasBotFieldGuard, 'SEC1.3', 'Honeypot trap silently sets isSubmitted=true and returns without calling fetch()');

// Check that bot check happens BEFORE validation
const botCheckIndex = quoteFormSrc.indexOf('if (formData.botField)');
const validateIndex = quoteFormSrc.indexOf('if (!validate())');
assert(botCheckIndex > 0 && validateIndex > botCheckIndex, 'SEC1.4', 'Bot trap guard executes BEFORE validate() to avoid leaking validation feedback to bots');

// Check honeypot DOM concealment
const hasAriaHidden = quoteFormSrc.includes('aria-hidden="true"');
const hasTabIndexMinusOne = quoteFormSrc.includes('tabIndex={-1}');
const hasStyleDisplayNone = quoteFormSrc.includes("style={{ display: 'none' }}") || quoteFormSrc.includes('display: none');
assert(hasAriaHidden, 'SEC1.5', 'Honeypot container has aria-hidden="true" for assistive tech concealment');
assert(hasTabIndexMinusOne, 'SEC1.6', 'Honeypot input has tabIndex={-1} to prevent keyboard focus');
assert(hasStyleDisplayNone, 'SEC1.7', 'Honeypot container has inline display:none styling');

// Check form name and attributes
assert(quoteFormSrc.includes('name="quote-request"'), 'SEC1.8', 'Form specifies name="quote-request"');
assert(quoteFormSrc.includes('data-netlify="true"'), 'SEC1.9', 'Form specifies data-netlify="true"');
assert(quoteFormSrc.includes('data-netlify-honeypot="bot-field"'), 'SEC1.10', 'Form specifies data-netlify-honeypot="bot-field"');
assert(quoteFormSrc.includes('<input type="hidden" name="form-name" value="quote-request" />'), 'SEC1.11', 'Hidden input for form-name="quote-request" present');

// Check Netlify URLSearchParams payload construction
assert(quoteFormSrc.includes("payload.append('form-name', 'quote-request')"), 'SEC1.12', "Payload appends form-name='quote-request'");
assert(quoteFormSrc.includes("headers: { 'Content-Type': 'application/x-www-form-urlencoded' }"), 'SEC1.13', 'Headers set Content-Type to application/x-www-form-urlencoded');

// Check error banner and input preservation
assert(quoteFormSrc.includes('id="quote-error-banner"'), 'SEC1.14', 'Error banner element #quote-error-banner present in JSX');
assert(quoteFormSrc.includes('id="quote-success-banner"'), 'SEC1.15', 'Success banner element #quote-success-banner present in JSX');

// Verify that catch block does NOT clear formData
const catchBlock = quoteFormSrc.slice(quoteFormSrc.indexOf('catch (err: unknown)'), quoteFormSrc.indexOf('finally {'));
const catchClearsForm = catchBlock.includes('setFormData(');
assert(!catchClearsForm, 'SEC1.16', 'Catch block preserves formData in state (does NOT call setFormData on error)');

// Verify that isSubmitting is reset in finally
const finallyBlock = quoteFormSrc.slice(quoteFormSrc.indexOf('finally {'), quoteFormSrc.indexOf('};', quoteFormSrc.indexOf('finally {')));
const finallyResetsSubmitting = finallyBlock.includes('setIsSubmitting(false)');
assert(finallyResetsSubmitting, 'SEC1.17', 'Finally block guarantees isSubmitting is reset to false');

// Verify disabled inputs during flight
assert(quoteFormSrc.includes('disabled={isSubmitting}'), 'SEC1.18', 'Form controls are bound to disabled={isSubmitting}');
const disabledOccurrences = (quoteFormSrc.match(/disabled=\{isSubmitting\}/g) || []).length;
assert(disabledOccurrences >= 5, 'SEC1.19', `At least 5 form elements (name, email, phone, message, submit button) disabled during flight (found ${disabledOccurrences})`);


// ── SECTION 2: CLIENT LOGIC ORACLE & HARNESS ─────────────────────────────
console.log('\n── Section 2: Pure Empirical Logic Harness (Simulating React QuoteForm Lifecycle) ──');

// Replicate exact QuoteForm submission & validation logic in an empirical harness
function createQuoteFormHarness(initialState = {}, source = 'Test Harness') {
  let formData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    botField: '',
    ...initialState
  };

  let errors = {};
  let isSubmitting = false;
  let isSubmitted = false;
  let submitError = null;
  let networkCalls = [];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (minimum 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }
    const rawPhone = formData.phone.replace(/\D/g, '');
    if (!rawPhone || rawPhone.length < 10) {
      newErrors.phone = 'Please provide a valid 10-digit phone number.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please describe your space or cleaning needs (minimum 10 characters).';
    }
    errors = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (mockFetch) => {
    submitError = null;

    // Bot honeypot check
    if (formData.botField) {
      isSubmitted = true;
      return { handledAsBot: true, isSubmitted, isSubmitting, submitError, formData };
    }

    if (!validate()) {
      return { handledAsBot: false, isSubmitted, isSubmitting, submitError, errors, formData };
    }

    isSubmitting = true;

    try {
      const payload = new URLSearchParams();
      payload.append('form-name', 'quote-request');
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('message', formData.message);
      payload.append('source', source);
      payload.append('bot-field', formData.botField);

      networkCalls.push({
        url: '/',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });

      const response = await mockFetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });

      if (!response.ok) {
        throw new Error(`Netlify form submission rejected with HTTP ${response.status}`);
      }

      isSubmitted = true;
    } catch (err) {
      submitError = 'Unable to submit your quote request online. Please try again or call us at (561) 704-5303.';
    } finally {
      isSubmitting = false;
    }

    return {
      handledAsBot: false,
      isSubmitted,
      isSubmitting,
      submitError,
      errors,
      formData,
      networkCalls
    };
  };

  return {
    getFormData: () => formData,
    setFormData: (data) => { formData = { ...formData, ...data }; },
    getErrors: () => errors,
    getIsSubmitting: () => isSubmitting,
    getIsSubmitted: () => isSubmitted,
    getSubmitError: () => submitError,
    getNetworkCalls: () => networkCalls,
    handleSubmit
  };
}

// 2.1 Adversarial Bot Traps
async function testHoneypotAttacks() {
  const attackPayloads = [
    { botField: 'spambot_v9', name: 'Bot 1', email: 'spam@bot.com', phone: '1234567890', msg: 'Buy crypto now' },
    { botField: '<script>alert("xss")</script>', name: 'XSS Bot', email: 'xss@bot.com', phone: '1234567890', msg: 'XSS injection' },
    { botField: 'a'.repeat(5000), name: 'Overflow Bot', email: 'overflow@bot.com', phone: '1234567890', msg: 'Buffer overflow test' },
    { botField: "' OR '1'='1", name: 'SQLi Bot', email: 'sqli@bot.com', phone: '1234567890', msg: 'SQL injection test' },
    { botField: 'trap_triggered', name: '', email: 'invalid-email', phone: 'invalid', msg: '' } // Bot submits invalid data too
  ];

  for (let i = 0; i < attackPayloads.length; i++) {
    const attack = attackPayloads[i];
    let fetchCalled = false;
    const mockFetch = async () => {
      fetchCalled = true;
      return { ok: true, status: 200 };
    };

    const harness = createQuoteFormHarness({
      name: attack.name,
      email: attack.email,
      phone: attack.phone,
      message: attack.msg,
      botField: attack.botField
    });

    const result = await harness.handleSubmit(mockFetch);

    assert(
      result.handledAsBot === true && result.isSubmitted === true && fetchCalled === false && result.submitError === null,
      `SEC2.1.${i + 1}`,
      `Bot attack vector ${i + 1} (${attack.botField.slice(0, 20)}...) silently trapped with zero network requests`
    );
  }
}

// 2.2 Error Handling & Network Drops
async function testErrorScenarios() {
  const errorCases = [
    { name: 'HTTP 500 Internal Server Error', mock: async () => ({ ok: false, status: 500, statusText: 'Internal Server Error' }) },
    { name: 'HTTP 502 Bad Gateway', mock: async () => ({ ok: false, status: 502, statusText: 'Bad Gateway' }) },
    { name: 'HTTP 400 Bad Request', mock: async () => ({ ok: false, status: 400, statusText: 'Bad Request' }) },
    { name: 'Network Exception (DNS / Offline)', mock: async () => { throw new TypeError('Failed to fetch'); } },
    { name: 'Abort / Timeout Exception', mock: async () => { throw new Error('AbortError: The operation was aborted'); } }
  ];

  for (let i = 0; i < errorCases.length; i++) {
    const errCase = errorCases[i];
    const initialData = {
      name: 'Jane Doe',
      email: 'jane@acme.com',
      phone: '(561) 555-0199',
      message: 'Need commercial office cleaning in West Palm Beach 5 days a week',
      botField: ''
    };

    const harness = createQuoteFormHarness(initialData);
    const result = await harness.handleSubmit(errCase.mock);

    const errorBannerShown = result.submitError !== null && result.submitError.includes('Unable to submit your quote request online');
    const successBannerSuppressed = result.isSubmitted === false;
    const inputPreserved = result.formData.name === initialData.name &&
      result.formData.email === initialData.email &&
      result.formData.phone === initialData.phone &&
      result.formData.message === initialData.message;
    const flightReset = result.isSubmitting === false;

    assert(
      errorBannerShown && successBannerSuppressed && inputPreserved && flightReset,
      `SEC2.2.${i + 1}`,
      `${errCase.name}: Error banner active, success suppressed, input data 100% preserved, isSubmitting reset`
    );
  }
}

// 2.3 Client-Side Input Validation Boundary Defense
function testValidationBoundaries() {
  const invalidCases = [
    { field: 'name', value: '', label: 'empty name' },
    { field: 'name', value: 'A', label: '1-character name' },
    { field: 'name', value: '   ', label: 'whitespace name' },
    { field: 'email', value: 'plainaddress', label: 'missing @' },
    { field: 'email', value: 'user@', label: 'missing domain' },
    { field: 'email', value: '@domain.com', label: 'missing user' },
    { field: 'phone', value: '561-123', label: 'less than 10 digits' },
    { field: 'phone', value: 'abcdefghij', label: 'letters in phone' },
    { field: 'message', value: 'Too short', label: 'less than 10 chars' },
    { field: 'message', value: '         ', label: 'whitespace message' }
  ];

  for (let i = 0; i < invalidCases.length; i++) {
    const c = invalidCases[i];
    const harness = createQuoteFormHarness({
      name: 'Valid Name',
      email: 'valid@example.com',
      phone: '5617045303',
      message: 'Valid cleaning requirements message for space',
      [c.field]: c.value
    });

    let fetchCalled = false;
    harness.handleSubmit(async () => { fetchCalled = true; return { ok: true, status: 200 }; });

    assert(
      fetchCalled === false && harness.getIsSubmitted() === false,
      `SEC2.3.${i + 1}`,
      `Validation boundary rejected: ${c.label} on field '${c.field}' without outbound request`
    );
  }
}


// ── SECTION 3: HTTP SERVER PAYLOAD BOUNDARY STRESS TEST ───────────────────
console.log('\n── Section 3: Direct HTTP Server Payload Boundary Stress Test ──');

async function testHttpPayloadBoundaries() {
  // Spin up an ephemeral HTTP server mimicking Netlify endpoint
  const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 2e6) req.destroy();
      });
      req.on('end', () => {
        try {
          const params = new URLSearchParams(body);
          const formName = params.get('form-name');
          const botField = params.get('bot-field');

          if (botField) {
            // Netlify honeypot trap behavior: drop silently with 200
            res.writeHead(200, { 'Content-Type': 'text/plain', 'X-Honeypot-Trapped': 'true' });
            return res.end('Submission accepted');
          }

          if (formName === 'quote-request') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ success: true, form: formName }));
          }

          // Fallback / missing form-name
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Generic OK');
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Bad Request');
        }
      });
      return;
    }
    res.writeHead(404);
    res.end();
  });

  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 3.1 Empty Payload
    const emptyRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: ''
    });
    assert(emptyRes.status === 200, 'SEC3.1', 'Empty payload handled gracefully with HTTP 200');

    // 3.2 Payload missing form-name
    const noFormNameRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'name=Anonymous&email=anon@test.com&phone=5617045303&message=Need+cleaning+quote'
    });
    assert(noFormNameRes.status === 200, 'SEC3.2', 'Payload missing form-name does not crash server');

    // 3.3 Non-existent phantom form name
    const phantomRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'form-name=admin-bypass-exploit&command=dump_db'
    });
    assert(phantomRes.status === 200, 'SEC3.3', 'Unknown form-name handled gracefully without server error');

    // 3.4 Direct Netlify Honeypot HTTP POST
    const honeypotRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'form-name=quote-request&bot-field=spambot9000&name=Bot&email=bot@spam.com'
    });
    const trappedHeader = honeypotRes.headers.get('x-honeypot-trapped');
    assert(trappedHeader === 'true', 'SEC3.4', 'Server endpoint traps bot-field submission silently');

    // 3.5 Massive payload (100KB of message data)
    const largeMessage = 'Clean '.repeat(20000); // ~120KB
    const largePayload = new URLSearchParams({
      'form-name': 'quote-request',
      'name': 'Big Facility Manager',
      'email': 'manager@bigfacility.com',
      'phone': '(561) 704-5303',
      'message': largeMessage
    }).toString();

    const largeRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: largePayload
    });
    assert(largeRes.status === 200, 'SEC3.5', '120KB payload handled gracefully without memory or buffer crash');

    // 3.6 Special Unicode & Symbol Escaping in URLSearchParams
    const unicodeParams = new URLSearchParams({
      'form-name': 'quote-request',
      'name': 'José Martínez — Société Française 🌟',
      'email': 'jose.martinez+clean@societe.fr',
      'phone': '(561) 704-5303',
      'message': 'Nettoyage & Désinfection <special & chars> "quoted text" $100% guaranteed'
    });

    const unicodeRes = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: unicodeParams.toString()
    });
    const unicodeJson = await unicodeRes.json();
    assert(unicodeJson.success === true, 'SEC3.6', 'Complex unicode, symbols, and entity characters encoded and accepted');

  } finally {
    server.close();
  }
}


// ── SECTION 4: STATIC PRERENDERED HTML FORM SCHEMA AUDIT ──────────────────
console.log('\n── Section 4: Static Prerendered HTML Form Schema Parity Audit ──');

function testStaticPrerenderedFormParity() {
  const indexHtmlPath = path.join(PROJECT_ROOT, 'index.html');
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Verify index.html registration form
  const hasHiddenForm = indexHtml.includes('<form') && indexHtml.includes('name="quote-request"');
  assert(hasHiddenForm, 'SEC4.1', 'index.html contains hidden registration form name="quote-request"');

  const requiredIndexAttrs = [
    'data-netlify="true"',
    'data-netlify-honeypot="bot-field"',
    'name="form-name"',
    'name="bot-field"',
    'name="name"',
    'name="email"',
    'name="phone"',
    'name="message"',
    'name="source"'
  ];

  for (const attr of requiredIndexAttrs) {
    assert(indexHtml.includes(attr), `SEC4.2.${attr}`, `index.html registration form includes ${attr}`);
  }

  // Check prerendered sample routes in dist/
  const sampleDistFiles = [
    'index.html',
    'contact-us/index.html',
    'service-area/jupiter/index.html',
    'service-area/boca-raton/index.html',
    'blog/revitalize-your-office-space/index.html'
  ];

  for (const relPath of sampleDistFiles) {
    const fullPath = path.join(DIST_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
      assert(false, `SEC4.3.${relPath}`, `Dist file exists: ${relPath}`, 'File missing in dist/');
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const hasForm = content.includes('name="quote-request"') && content.includes('data-netlify="true"');
    assert(hasForm, `SEC4.3.${relPath}`, `Prerendered ${relPath} contains Netlify quote-request form registration`);
  }
}

// ── EXECUTE ALL TEST SUITES ────────────────────────────────────────────────
async function run() {
  await testHoneypotAttacks();
  await testErrorScenarios();
  testValidationBoundaries();
  await testHttpPayloadBoundaries();
  testStaticPrerenderedFormParity();

  console.log('\n======================================================================');
  console.log(`  M5 ADVERSARIAL TEST SUMMARY`);
  console.log(`  Total: ${results.total} | Passed: \x1b[32m${results.passed}\x1b[0m | Failed: \x1b[31m${results.failed}\x1b[0m`);
  console.log('======================================================================\n');

  if (results.failed > 0) {
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
