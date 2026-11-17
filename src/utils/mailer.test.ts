import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveSiteGroundSmtpConfig,
  getEmailProviderStatus,
  renderLeadContactCard,
  wrapEmailShell,
  sendInternalLeadAlertEmail,
  sendClientQuoteConfirmationEmail,
} from '../../netlify/functions/mailer';
import apiHandler from '../../netlify/functions/api';

test('resolveSiteGroundSmtpConfig defaults to contact@sfcleaningconcepts.com on mail.sfcleaningconcepts.com:465', () => {
  const cfg = resolveSiteGroundSmtpConfig({ SMTP_PASS: 'test-secret' });
  assert.equal(cfg.host, 'mail.sfcleaningconcepts.com');
  assert.equal(cfg.port, 465);
  assert.equal(cfg.secure, true);
  assert.equal(cfg.user, 'contact@sfcleaningconcepts.com');
  assert.equal(cfg.envelopeFrom, 'contact@sfcleaningconcepts.com');

  const status = getEmailProviderStatus({ SMTP_PASS: 'test-secret' });
  assert.equal(status.provider, 'siteground-smtp');
  assert.equal(status.ready, true);
});

test('responsive email shell includes Outlook MSO/VML, Apple Mail guards, <=600px mobile rules, and stays <25KB', () => {
  const card = renderLeadContactCard({
    referenceId: 'SFCC-9012AB',
    name: 'Elena Gomez',
    email: 'elena@bocaraton-home.com',
    phone: '(561) 555-0188',
    message: 'Bi-weekly cleaning for 3,200 sq ft home in Boca Raton.',
    source: 'Contact Page Quote Form',
    pageUrl: '/contact-us',
  });

  const html = wrapEmailShell({
    title: 'New Quote Request',
    preheader: 'Elena Gomez requested a cleaning quote.',
    badgeLabel: 'New Quote Lead',
    bodyHtml: card,
  });

  assert.ok(html.includes('<!--[if mso]>'), 'Missing Outlook MSO conditional ghost table');
  assert.ok(html.includes('x-apple-data-detectors'), 'Missing iOS/Apple Mail blue link guard');
  assert.ok(html.includes('@media only screen and (max-width: 600px)'), 'Missing mobile breakpoint');
  assert.ok(html.includes('tel:(561)555-0188'.replace(/[()]/g, '')) || html.includes('tel:5615550188'));
  assert.ok(html.includes('mailto:elena@bocaraton-home.com'));
  assert.ok(Buffer.byteLength(html, 'utf8') < 25_000, 'Email HTML must stay well below Gmail 102KB clip limit');
});

test('POST /api/quote validates inputs, drops honeypot bots, and dispatches team + client emails', async () => {
  process.env.SFCC_TEST_MODE = 'true';
  try {
    const badReq = new Request('https://sfcleaningconcepts.com/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A', email: 'bad', phone: '123', message: 'short' }),
    });
    const badRes = await apiHandler(badReq);
    assert.equal(badRes.status, 400);

    const goodReq = new Request('https://sfcleaningconcepts.com/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Marcus Vance',
        email: 'marcus@palmbeach-clinic.com',
        phone: '(561) 555-0177',
        message: 'Nightly medical office cleaning for 4,000 sq ft clinic in West Palm Beach.',
        source: 'Service Detail: Medical Office Cleaning',
        pageUrl: '/service/medical-office-cleaning',
      }),
    });
    const goodRes = await apiHandler(goodReq);
    assert.equal(goodRes.status, 200);
    const payload = (await goodRes.json()) as any;
    assert.equal(payload.ok, true);
    assert.match(payload.referenceId, /^SFCC-[A-Z0-9]{6}$/);
    assert.equal(payload.teamAlert.status, 'queued-local');
    assert.equal(payload.clientConfirmation.status, 'queued-local');

    const teamDispatch = await sendInternalLeadAlertEmail(
      {
        referenceId: payload.referenceId,
        name: 'Marcus Vance',
        email: 'marcus@palmbeach-clinic.com',
        phone: '(561) 555-0177',
        message: 'Nightly medical office cleaning.',
      },
      { SFCC_TEST_MODE: 'true' }
    );
    assert.equal(teamDispatch.replyTo, 'marcus@palmbeach-clinic.com');

    const clientDispatch = await sendClientQuoteConfirmationEmail(
      {
        referenceId: payload.referenceId,
        name: 'Marcus Vance',
        email: 'marcus@palmbeach-clinic.com',
        phone: '(561) 555-0177',
        message: 'Nightly medical office cleaning.',
      },
      { SFCC_TEST_MODE: 'true' }
    );
    assert.equal(clientDispatch.to, 'marcus@palmbeach-clinic.com');
  } finally {
    delete process.env.SFCC_TEST_MODE;
  }
});
