import test from 'node:test';
import assert from 'node:assert/strict';
import { lockBodyScroll } from './bodyScrollLock';

function withMockDocument(initialOverflow: string, fn: (bodyStyle: { overflow: string }) => void): void {
  const originalDocument = (globalThis as { document?: Document }).document;
  const bodyStyle = { overflow: initialOverflow };
  (globalThis as { document?: unknown }).document = {
    body: {
      style: bodyStyle,
    },
  };
  try {
    fn(bodyStyle);
  } finally {
    if (originalDocument === undefined) {
      delete (globalThis as { document?: Document }).document;
    } else {
      (globalThis as { document?: Document }).document = originalDocument;
    }
  }
}

test('lockBodyScroll sets overflow to hidden and restores empty string on release', () => {
  withMockDocument('', (bodyStyle) => {
    const release = lockBodyScroll();
    assert.equal(bodyStyle.overflow, 'hidden');
    release();
    assert.equal(bodyStyle.overflow, '');
  });
});

test('lockBodyScroll preserves and restores pre-existing body overflow value', () => {
  withMockDocument('auto', (bodyStyle) => {
    const release = lockBodyScroll();
    assert.equal(bodyStyle.overflow, 'hidden');
    release();
    assert.equal(bodyStyle.overflow, 'auto');
  });
});

test('lockBodyScroll handles nested and out-of-order releases without premature unlock', () => {
  withMockDocument('clip', (bodyStyle) => {
    const releaseA = lockBodyScroll();
    assert.equal(bodyStyle.overflow, 'hidden');

    const releaseB = lockBodyScroll();
    assert.equal(bodyStyle.overflow, 'hidden');

    // Release first lock while second lock is still active
    releaseA();
    assert.equal(bodyStyle.overflow, 'hidden');

    // Release second lock — original overflow must now be restored
    releaseB();
    assert.equal(bodyStyle.overflow, 'clip');
  });
});

test('lockBodyScroll release function is idempotent on double release', () => {
  withMockDocument('scroll', (bodyStyle) => {
    const releaseA = lockBodyScroll();
    const releaseB = lockBodyScroll();

    // Double-releasing A must not decrement B's reference count
    releaseA();
    releaseA();
    assert.equal(bodyStyle.overflow, 'hidden');

    releaseB();
    assert.equal(bodyStyle.overflow, 'scroll');

    // Extra release after full unlock is also a safe no-op
    bodyStyle.overflow = 'visible';
    releaseB();
    assert.equal(bodyStyle.overflow, 'visible');
  });
});

test('lockBodyScroll is a safe no-op when document is unavailable', () => {
  const originalDocument = (globalThis as { document?: Document }).document;
  delete (globalThis as { document?: Document }).document;
  try {
    const release = lockBodyScroll();
    assert.doesNotThrow(() => release());
  } finally {
    if (originalDocument !== undefined) {
      (globalThis as { document?: Document }).document = originalDocument;
    }
  }
});

test('lockBodyScroll re-captures current body.style.overflow on fresh lock cycle after full unlock', () => {
  withMockDocument('auto', (bodyStyle) => {
    const release1 = lockBodyScroll();
    assert.equal(bodyStyle.overflow, 'hidden');
    release1();
    assert.equal(bodyStyle.overflow, 'auto');

    bodyStyle.overflow = 'visible';
    const release2 = lockBodyScroll();
    const release3 = lockBodyScroll();
    assert.equal(bodyStyle.overflow, 'hidden');
    release2();
    assert.equal(bodyStyle.overflow, 'hidden');
    release3();
    assert.equal(bodyStyle.overflow, 'visible');
  });
});
