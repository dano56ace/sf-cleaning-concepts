import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MIN_DESKTOP_DWELL_MS,
  MIN_MOBILE_DWELL_MS,
  isExitIntentEligibleRoute,
  isPreviewExitIntentRequested,
  shouldTriggerDesktopExitIntent,
  shouldTriggerMobileScrollExitIntent,
} from './exitIntentLogic';

test('isExitIntentEligibleRoute blocks converted, already-shown, open-modal, and contact routes', () => {
  assert.equal(
    isExitIntentEligibleRoute({
      alreadyShown: false,
      alreadyConverted: false,
      isOtherModalOpen: false,
      pathname: '/',
    }),
    true
  );

  assert.equal(
    isExitIntentEligibleRoute({
      alreadyShown: true,
      alreadyConverted: false,
      isOtherModalOpen: false,
      pathname: '/',
    }),
    false
  );

  assert.equal(
    isExitIntentEligibleRoute({
      alreadyShown: false,
      alreadyConverted: true,
      isOtherModalOpen: false,
      pathname: '/our-services',
    }),
    false
  );

  assert.equal(
    isExitIntentEligibleRoute({
      alreadyShown: false,
      alreadyConverted: false,
      isOtherModalOpen: true,
      pathname: '/our-services',
    }),
    false
  );

  assert.equal(
    isExitIntentEligibleRoute({
      alreadyShown: false,
      alreadyConverted: false,
      isOtherModalOpen: false,
      pathname: '/contact-us',
    }),
    false
  );
});

test('shouldTriggerDesktopExitIntent enforces 10s dwell, user interaction, and top-edge exit', () => {
  const base = {
    alreadyShown: false,
    alreadyConverted: false,
    isOtherModalOpen: false,
    pathname: '/our-services',
    elapsedMs: MIN_DESKTOP_DWELL_MS + 500,
    hasInteracted: true,
    clientY: 4,
    hasRelatedTarget: false,
  };

  assert.equal(shouldTriggerDesktopExitIntent(base), true);
  assert.equal(shouldTriggerDesktopExitIntent({ ...base, elapsedMs: 4000 }), false);
  assert.equal(shouldTriggerDesktopExitIntent({ ...base, hasInteracted: false }), false);
  assert.equal(shouldTriggerDesktopExitIntent({ ...base, clientY: 45 }), false);
  assert.equal(shouldTriggerDesktopExitIntent({ ...base, hasRelatedTarget: true }), false);
});

test('shouldTriggerMobileScrollExitIntent requires 15s dwell, deep scroll, and sharp upward return', () => {
  const base = {
    alreadyShown: false,
    alreadyConverted: false,
    isOtherModalOpen: false,
    pathname: '/service/office-cleaning',
    elapsedMs: MIN_MOBILE_DWELL_MS + 1000,
    maxScrollY: 640,
    previousScrollY: 310,
    currentScrollY: 210,
  };

  assert.equal(shouldTriggerMobileScrollExitIntent(base), true);
  assert.equal(shouldTriggerMobileScrollExitIntent({ ...base, elapsedMs: 8000 }), false);
  assert.equal(shouldTriggerMobileScrollExitIntent({ ...base, maxScrollY: 200 }), false);
  assert.equal(
    shouldTriggerMobileScrollExitIntent({ ...base, previousScrollY: 230, currentScrollY: 210 }),
    false
  );
});

test('isPreviewExitIntentRequested detects ?exit_intent=1 cleanly', () => {
  assert.equal(isPreviewExitIntentRequested('?exit_intent=1'), true);
  assert.equal(isPreviewExitIntentRequested('?utm_source=google&exit_intent=1'), true);
  assert.equal(isPreviewExitIntentRequested('?exit_intent=0'), false);
  assert.equal(isPreviewExitIntentRequested(''), false);
});
