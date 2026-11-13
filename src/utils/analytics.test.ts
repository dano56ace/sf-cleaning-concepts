import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GA_MEASUREMENT_ID,
  extractTelNumber,
  trackSpaPageView,
  trackLeadSubmission,
  trackClickToCall
} from './analytics';

test('extractTelNumber parses valid tel: links and ignores others', () => {
  assert.equal(extractTelNumber('tel:5617045303'), '5617045303');
  assert.equal(extractTelNumber('tel:+15617045303'), '+15617045303');
  assert.equal(extractTelNumber('mailto:Sflcleaningco@gmail.com'), null);
  assert.equal(extractTelNumber('/contact-us'), null);
  assert.equal(extractTelNumber(''), null);
});

test('trackSpaPageView dispatches config event with G-R1LCQWZJW0', () => {
  const calls: Array<{ cmd: string; target: unknown; params?: Record<string, unknown> }> = [];
  const sent = trackSpaPageView('/our-services', 'Our Services', (cmd, target, params) => {
    calls.push({ cmd, target, params });
  });

  assert.equal(sent, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].cmd, 'config');
  assert.equal(calls[0].target, GA_MEASUREMENT_ID);
  assert.deepEqual(calls[0].params, {
    page_path: '/our-services',
    page_title: 'Our Services'
  });
});

test('trackLeadSubmission dispatches generate_lead conversion event', () => {
  const calls: Array<{ cmd: string; target: unknown; params?: Record<string, unknown> }> = [];
  const sent = trackLeadSubmission(
    { source: 'Hero Main Booking Form', pagePath: '/' },
    (cmd, target, params) => {
      calls.push({ cmd, target, params });
    }
  );

  assert.equal(sent, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].cmd, 'event');
  assert.equal(calls[0].target, 'generate_lead');
  assert.equal(calls[0].params?.form_source, 'Hero Main Booking Form');
  assert.equal(calls[0].params?.page_path, '/');
});

test('trackClickToCall dispatches click_to_call conversion event', () => {
  const calls: Array<{ cmd: string; target: unknown; params?: Record<string, unknown> }> = [];
  const sent = trackClickToCall(
    { phoneNumber: '5617045303', linkLocation: 'site-header', pagePath: '/contact-us' },
    (cmd, target, params) => {
      calls.push({ cmd, target, params });
    }
  );

  assert.equal(sent, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].cmd, 'event');
  assert.equal(calls[0].target, 'click_to_call');
  assert.equal(calls[0].params?.phone_number, '5617045303');
  assert.equal(calls[0].params?.link_location, 'site-header');
  assert.equal(calls[0].params?.page_path, '/contact-us');
});
