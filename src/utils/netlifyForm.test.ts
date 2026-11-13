import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NETLIFY_FORM_NAME,
  NETLIFY_REGISTERED_FIELDS,
  validateQuoteFields,
  buildNetlifyFormPayload,
  submitNetlifyQuoteForm
} from './netlifyForm';
import { computeParallaxOffset, selectHeroIndexBySlug } from './parallaxMath';

test('validateQuoteFields enforces required fields and format constraints', () => {
  const emptyCheck = validateQuoteFields({
    name: '',
    email: 'invalid-email',
    phone: '561',
    message: 'too short'
  });
  assert.equal(emptyCheck.isValid, false);
  assert.ok(emptyCheck.errors.name);
  assert.ok(emptyCheck.errors.email);
  assert.ok(emptyCheck.errors.phone);
  assert.ok(emptyCheck.errors.message);

  const validCheck = validateQuoteFields({
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '(561) 555-0199',
    message: 'Looking for bi-weekly cleaning for our 3BR home in Boca Raton.'
  });
  assert.equal(validCheck.isValid, true);
  assert.deepEqual(validCheck.errors, {});
});

test('buildNetlifyFormPayload includes form-name=quote-request and strictly registered fields', () => {
  const encoded = buildNetlifyFormPayload({
    name: '  Jane Doe ',
    email: ' jane@example.com ',
    phone: '(561) 555-0199',
    message: 'Need a deep clean before family visits next week.',
    source: 'Hero Main Booking Form',
    pageUrl: '/service-area/boca-raton',
    botField: ''
  });

  const parsed = new URLSearchParams(encoded);
  assert.equal(parsed.get('form-name'), NETLIFY_FORM_NAME);
  assert.equal(parsed.get('name'), 'Jane Doe');
  assert.equal(parsed.get('email'), 'jane@example.com');
  assert.equal(parsed.get('phone'), '(561) 555-0199');
  assert.equal(parsed.get('source'), 'Hero Main Booking Form');
  assert.equal(parsed.get('page_url'), '/service-area/boca-raton');
  assert.equal(parsed.get('bot-field'), '');

  // Ensure every single serialized key is registered in build-time HTML schema
  const registeredSet = new Set<string>(NETLIFY_REGISTERED_FIELDS);
  for (const key of parsed.keys()) {
    assert.equal(
      registeredSet.has(key),
      true,
      `Unexpected unregistered Netlify field key: ${key}`
    );
  }
  assert.equal(Array.from(parsed.keys()).length, NETLIFY_REGISTERED_FIELDS.length);
});

test('submitNetlifyQuoteForm posts application/x-www-form-urlencoded to root action', async () => {
  let capturedUrl = '';
  let capturedInit: RequestInit | undefined;

  const mockFetch: typeof fetch = async (input, init) => {
    capturedUrl = String(input);
    capturedInit = init;
    return new Response('OK', { status: 200 });
  };

  const res = await submitNetlifyQuoteForm(
    {
      name: 'Carlos Rivera',
      email: 'carlos@miami-office.com',
      phone: '(305) 555-0144',
      message: 'Weekly evening cleaning for 2,400 sq ft dental office.',
      source: 'Quote Modal: Medical Office Cleaning',
      pageUrl: '/our-services'
    },
    mockFetch
  );

  assert.equal(res.honeypotTripped, false);
  assert.equal(capturedUrl, '/');
  assert.equal(capturedInit?.method, 'POST');
  assert.deepEqual(capturedInit?.headers, {
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  assert.ok(String(capturedInit?.body).includes('form-name=quote-request'));
  assert.ok(String(capturedInit?.body).includes('page_url=%2Four-services'));
});

test('submitNetlifyQuoteForm short-circuits honeypot bot submissions without network call', async () => {
  let called = false;
  const mockFetch: typeof fetch = async () => {
    called = true;
    return new Response('OK', { status: 200 });
  };

  const res = await submitNetlifyQuoteForm(
    {
      name: 'Spam Bot',
      email: 'bot@spam.example',
      phone: '(561) 000-0000',
      message: 'Automated spam payload message here',
      botField: 'http://spam-link.example'
    },
    mockFetch
  );

  assert.equal(res.honeypotTripped, true);
  assert.equal(called, false);
});

test('computeParallaxOffset shifts smoothly with scroll and clamps within safe bounds', () => {
  assert.equal(computeParallaxOffset(0, 420, 900, 0.28, 96), 0);
  // Scrolled 200px down -> rectTop = -200 -> offset = +56px
  assert.equal(computeParallaxOffset(-200, 420, 900, 0.28, 96), 56);
  // Scrolled far down -> clamped to maxShift (96px)
  assert.equal(computeParallaxOffset(-800, 420, 900, 0.28, 96), 96);
  // Deterministic slug selection stays within pool bounds
  const idx = selectHeroIndexBySlug('boca-raton', 5);
  assert.equal(idx >= 0 && idx < 5, true);
  assert.equal(selectHeroIndexBySlug('boca-raton', 5), idx);
});
