import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cancelSmoothScroll,
  computeElementTargetScrollY,
  computeSmoothScrollDuration,
  easeInOutCubic,
  isProgrammaticScrollRecent,
  isSmoothScrollActive,
  prefersReducedMotion,
  smoothScrollTo,
  smoothScrollToElement,
} from './smoothScroll';

test('easeInOutCubic maps endpoints and midpoint accurately', () => {
  assert.equal(easeInOutCubic(-0.2), 0);
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(0.5), 0.5);
  assert.equal(easeInOutCubic(1), 1);
  assert.equal(easeInOutCubic(1.5), 1);
});

test('computeSmoothScrollDuration returns 0 for <1px and bounds to [280, 360]ms', () => {
  assert.equal(computeSmoothScrollDuration(0), 0);
  assert.equal(computeSmoothScrollDuration(0.4), 0);
  assert.equal(computeSmoothScrollDuration(100), 280);
  assert.equal(computeSmoothScrollDuration(-1000), 300);
  assert.equal(computeSmoothScrollDuration(5000), 360);
});

test('computeElementTargetScrollY honors scroll-margin-top, centering, and document bounds', () => {
  // Start alignment with scroll-mt-24 (96px)
  assert.equal(
    computeElementTargetScrollY({
      rectTop: 3900,
      rectHeight: 200,
      scrollY: 400,
      innerHeight: 900,
      scrollHeight: 6000,
      scrollMarginTop: 96,
      block: 'start',
    }),
    4204
  );

  // Center alignment (HeroVideo #quote-name on mobile 812px)
  assert.equal(
    computeElementTargetScrollY({
      rectTop: 1131,
      rectHeight: 44,
      scrollY: 0,
      innerHeight: 812,
      scrollHeight: 5000,
      block: 'center',
    }),
    747
  );

  // Clamped to 0 at top and maxScrollY at bottom
  assert.equal(
    computeElementTargetScrollY({
      rectTop: 370,
      rectHeight: 44,
      scrollY: 0,
      innerHeight: 900,
      scrollHeight: 5000,
      block: 'center',
    }),
    0
  );
  assert.equal(
    computeElementTargetScrollY({
      rectTop: 4800,
      rectHeight: 100,
      scrollY: 0,
      innerHeight: 900,
      scrollHeight: 5000,
      scrollMarginTop: 96,
      block: 'start',
    }),
    4100
  );
});

test('smoothScrollTo executes rAF steps with behavior: instant and aborts cleanly on cancelSmoothScroll', () => {
  const originalWindow = (globalThis as { window?: unknown }).window;
  const originalDocument = (globalThis as { document?: unknown }).document;
  const originalPerf = (globalThis as { performance?: unknown }).performance;

  let currentScrollY = 0;
  let now = 1000;
  let nextRafId = 1;
  const rafQueue = new Map<number, (time: number) => void>();
  const scrollCalls: Array<{ top: number; behavior?: ScrollBehavior }> = [];
  const listeners = new Map<string, Set<EventListener>>();

  (globalThis as { performance?: unknown }).performance = {
    now: () => now,
  };
  (globalThis as { document?: unknown }).document = {
    documentElement: { scrollHeight: 5000 },
    body: { scrollHeight: 5000 },
  };
  (globalThis as { window?: unknown }).window = {
    scrollX: 0,
    get scrollY() {
      return currentScrollY;
    },
    innerHeight: 900,
    matchMedia: () => ({ matches: false }),
    scrollTo: (opts: { left?: number; top?: number; behavior?: ScrollBehavior }) => {
      currentScrollY = opts.top ?? currentScrollY;
      scrollCalls.push({ top: currentScrollY, behavior: opts.behavior });
    },
    requestAnimationFrame: (cb: (time: number) => void) => {
      const id = nextRafId++;
      rafQueue.set(id, cb);
      return id;
    },
    cancelAnimationFrame: (id: number) => {
      rafQueue.delete(id);
    },
    addEventListener: (type: string, fn: EventListener) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)?.add(fn);
    },
    removeEventListener: (type: string, fn: EventListener) => {
      listeners.get(type)?.delete(fn);
    },
  };

  try {
    let completed = false;
    smoothScrollTo({
      top: 1000,
      durationMs: 300,
      onComplete: () => {
        completed = true;
      },
    });

    assert.equal(isSmoothScrollActive(), true);
    assert.equal(rafQueue.size, 1);

    // Step mid-animation (150ms)
    const firstEntry = rafQueue.entries().next().value as [number, (t: number) => void];
    rafQueue.delete(firstEntry[0]);
    now = 1150;
    firstEntry[1](now);

    assert.equal(currentScrollY, 500);
    assert.equal(scrollCalls[0]?.behavior, 'instant');
    assert.equal(completed, false);
    assert.equal(isSmoothScrollActive(), true);

    // Simulate route PUSH calling cancelSmoothScroll() + instant reset to 0
    cancelSmoothScroll();
    assert.equal(isSmoothScrollActive(), false);
    assert.equal(rafQueue.size, 0);
    currentScrollY = 0;

    // Even if a stale frame callback were somehow invoked, it must not move scrollY or fire onComplete
    now = 1350;
    firstEntry[1](now);
    assert.equal(currentScrollY, 0);
    assert.equal(completed, false);

    // Fresh run completes and cleans up listeners + invokes onComplete
    let completedSecond = false;
    smoothScrollTo({
      top: 800,
      durationMs: 300,
      onComplete: () => {
        completedSecond = true;
      },
    });
    const entry2 = rafQueue.entries().next().value as [number, (t: number) => void];
    rafQueue.delete(entry2[0]);
    now = 1700;
    entry2[1](now);

    assert.equal(currentScrollY, 800);
    assert.equal(completedSecond, true);
    assert.equal(isSmoothScrollActive(), false);
    assert.equal(listeners.get('wheel')?.size ?? 0, 0);
  } finally {
    cancelSmoothScroll();
    if (originalWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window?: unknown }).window = originalWindow;
    }
    if (originalDocument === undefined) {
      delete (globalThis as { document?: unknown }).document;
    } else {
      (globalThis as { document?: unknown }).document = originalDocument;
    }
    if (originalPerf === undefined) {
      delete (globalThis as { performance?: unknown }).performance;
    } else {
      (globalThis as { performance?: unknown }).performance = originalPerf;
    }
  }
});

test('smoothScrollTo respects prefers-reduced-motion by jumping immediately with behavior: instant', () => {
  const originalWindow = (globalThis as { window?: unknown }).window;
  const originalDocument = (globalThis as { document?: unknown }).document;

  let currentScrollY = 0;
  let rafCalled = false;
  let completed = false;
  const behaviors: Array<ScrollBehavior | undefined> = [];

  (globalThis as { document?: unknown }).document = {
    documentElement: { scrollHeight: 4000 },
    body: { scrollHeight: 4000 },
  };
  (globalThis as { window?: unknown }).window = {
    scrollX: 0,
    get scrollY() {
      return currentScrollY;
    },
    innerHeight: 900,
    matchMedia: () => ({ matches: true }),
    scrollTo: (opts: { left?: number; top?: number; behavior?: ScrollBehavior }) => {
      currentScrollY = opts.top ?? currentScrollY;
      behaviors.push(opts.behavior);
    },
    requestAnimationFrame: () => {
      rafCalled = true;
      return 1;
    },
    cancelAnimationFrame: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  };

  try {
    smoothScrollTo({
      top: 1200,
      onComplete: () => {
        completed = true;
      },
    });
    assert.equal(rafCalled, false);
    assert.equal(currentScrollY, 1200);
    assert.deepEqual(behaviors, ['instant']);
    assert.equal(completed, true);
  } finally {
    cancelSmoothScroll();
    if (originalWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window?: unknown }).window = originalWindow;
    }
    if (originalDocument === undefined) {
      delete (globalThis as { document?: unknown }).document;
    } else {
      (globalThis as { document?: unknown }).document = originalDocument;
    }
  }
});

function withMockSmoothScrollEnv(
  opts: { reducedMotion?: boolean; scrollHeight?: number; bodyScrollHeight?: number } = {},
  fn: (env: {
    getScrollY: () => number;
    setScrollY: (y: number) => void;
    setNow: (t: number) => void;
    rafQueue: Map<number, (t: number) => void>;
    dispatch: (type: string, e?: unknown) => void;
    getListenerCounts: () => { add: number; remove: number };
  }) => void
) {
  const originalWindow = (globalThis as { window?: unknown }).window;
  const originalDocument = (globalThis as { document?: unknown }).document;
  const originalPerf = (globalThis as { performance?: unknown }).performance;

  let currentScrollY = 0;
  let currentScrollX = 0;
  let now = 1000;
  let nextRafId = 1;
  const rafQueue = new Map<number, (t: number) => void>();
  const listeners = new Map<string, Set<(e: unknown) => void>>();
  let add = 0;
  let remove = 0;

  (globalThis as { performance?: unknown }).performance = { now: () => now };
  (globalThis as { document?: unknown }).document = {
    documentElement: { scrollHeight: opts.scrollHeight ?? 5000 },
    body: { scrollHeight: opts.bodyScrollHeight ?? 5000 },
  };
  (globalThis as { window?: unknown }).window = {
    get scrollX() {
      return currentScrollX;
    },
    get scrollY() {
      return currentScrollY;
    },
    innerHeight: 900,
    matchMedia: () => ({ matches: Boolean(opts.reducedMotion) }),
    getComputedStyle: (el: { __scrollMarginTop?: string }) => ({
      scrollMarginTop: el.__scrollMarginTop ?? '0px',
    }),
    scrollTo: (o: { left?: number; top?: number }) => {
      currentScrollX = o.left ?? currentScrollX;
      currentScrollY = o.top ?? currentScrollY;
    },
    requestAnimationFrame: (cb: (t: number) => void) => {
      const id = nextRafId++;
      rafQueue.set(id, cb);
      return id;
    },
    cancelAnimationFrame: (id: number) => {
      rafQueue.delete(id);
    },
    addEventListener: (type: string, cb: (e: unknown) => void) => {
      add++;
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(cb);
    },
    removeEventListener: (type: string, cb: (e: unknown) => void) => {
      remove++;
      listeners.get(type)?.delete(cb);
    },
  };

  try {
    fn({
      getScrollY: () => currentScrollY,
      setScrollY: (y: number) => {
        currentScrollY = y;
      },
      setNow: (t: number) => {
        now = t;
      },
      rafQueue,
      dispatch: (type: string, e: unknown = {}) => {
        for (const cb of Array.from(listeners.get(type) ?? [])) cb(e);
      },
      getListenerCounts: () => ({ add, remove }),
    });
  } finally {
    cancelSmoothScroll();
    if (originalWindow === undefined) delete (globalThis as { window?: unknown }).window;
    else (globalThis as { window?: unknown }).window = originalWindow;
    if (originalDocument === undefined) delete (globalThis as { document?: unknown }).document;
    else (globalThis as { document?: unknown }).document = originalDocument;
    if (originalPerf === undefined) delete (globalThis as { performance?: unknown }).performance;
    else (globalThis as { performance?: unknown }).performance = originalPerf;
  }
}

test('smoothScrollTo cancels without firing onComplete on wheel/touchstart/pointerdown/interrupt key, ignoring Tab', () => {
  for (const [type, eventObj] of [
    ['wheel', {}],
    ['touchstart', {}],
    ['pointerdown', {}],
    ['keydown', { key: 'ArrowDown' }],
    ['keydown', { key: 'Escape' }],
    ['keydown', { key: ' ' }],
  ] as const) {
    withMockSmoothScrollEnv({}, (env) => {
      let completed = false;
      smoothScrollTo({
        top: 1200,
        durationMs: 300,
        onComplete: () => {
          completed = true;
        },
      });
      env.dispatch('keydown', { key: 'Tab' });
      assert.equal(isSmoothScrollActive(), true);
      env.dispatch(type, eventObj);
      assert.equal(isSmoothScrollActive(), false);
      assert.equal(completed, false);
      assert.equal(env.rafQueue.size, 0);
      assert.equal(env.getListenerCounts().add, env.getListenerCounts().remove);
    });
  }
});

test('concurrent smoothScrollTo supersedes prior run without firing stale onComplete or leaking listeners', () => {
  withMockSmoothScrollEnv({}, (env) => {
    let firstDone = false;
    let secondDone = false;
    smoothScrollTo({
      top: 1000,
      durationMs: 300,
      onComplete: () => {
        firstDone = true;
      },
    });
    const staleEntry = env.rafQueue.entries().next().value as [number, (t: number) => void];
    smoothScrollTo({
      top: 450,
      durationMs: 300,
      onComplete: () => {
        secondDone = true;
      },
    });
    env.setNow(1500);
    staleEntry[1](1500);
    assert.equal(firstDone, false);

    const activeEntry = env.rafQueue.entries().next().value as [number, (t: number) => void];
    env.rafQueue.delete(activeEntry[0]);
    activeEntry[1](1500);
    assert.equal(secondDone, true);
    assert.equal(env.getScrollY(), 450);
    assert.equal(env.getListenerCounts().add, env.getListenerCounts().remove);
  });
});

test('smoothScrollToElement parses scrollMarginTop and honors block=center & max(doc, body) scrollHeight', () => {
  withMockSmoothScrollEnv({ scrollHeight: 2000, bodyScrollHeight: 4500 }, (env) => {
    const elStart = {
      __scrollMarginTop: '96px',
      getBoundingClientRect: () => ({ top: 3200, height: 60 }),
    } as unknown as HTMLElement;
    let done = false;
    smoothScrollToElement(elStart, {
      block: 'start',
      behavior: 'instant',
      onComplete: () => {
        done = true;
      },
    });
    assert.equal(env.getScrollY(), 3104);
    assert.equal(done, true);

    const elInvalidMargin = {
      __scrollMarginTop: 'auto',
      getBoundingClientRect: () => ({ top: 100, height: 40 }),
    } as unknown as HTMLElement;
    env.setScrollY(0);
    smoothScrollToElement(elInvalidMargin, { block: 'center', behavior: 'instant' });
    assert.equal(env.getScrollY(), 0);
  });
});

test('prefersReducedMotion handles SSR and matchMedia states safely', () => {
  const originalWindow = (globalThis as { window?: unknown }).window;
  delete (globalThis as { window?: unknown }).window;
  try {
    assert.equal(prefersReducedMotion(), false);
  } finally {
    if (originalWindow !== undefined) (globalThis as { window?: unknown }).window = originalWindow;
  }
  withMockSmoothScrollEnv({ reducedMotion: true }, () => {
    assert.equal(prefersReducedMotion(), true);
  });
});

test('smoothScrollTo snaps synchronously for durationMs <= 0 and ignores non-finite top values', () => {
  withMockSmoothScrollEnv({}, (env) => {
    let completed = false;
    smoothScrollTo({
      top: 800,
      durationMs: 0,
      onComplete: () => {
        completed = true;
      },
    });
    assert.equal(completed, true);
    assert.equal(isSmoothScrollActive(), false);
    assert.equal(env.rafQueue.size, 0);
    assert.equal(env.getListenerCounts().add, 0);
    assert.equal(env.getScrollY(), 800);

    smoothScrollTo({ top: Number.NaN, durationMs: 300 });
    assert.equal(isSmoothScrollActive(), false);
    assert.equal(env.rafQueue.size, 0);
    assert.equal(env.getListenerCounts().add, 0);
    assert.equal(env.getScrollY(), 800);
  });
});

test('isProgrammaticScrollRecent tracks instant/completed smooth scrolls and clears on user interrupt', () => {
  withMockSmoothScrollEnv({}, (env) => {
    env.setNow(2000);
    smoothScrollTo({ top: 300, behavior: 'instant' });
    assert.equal(isProgrammaticScrollRecent(50), true);
    env.setNow(2049);
    assert.equal(isProgrammaticScrollRecent(50), true);
    env.setNow(2050);
    assert.equal(isProgrammaticScrollRecent(50), false);

    // User wheel interrupt immediately clears recent programmatic scroll flag
    env.setNow(3000);
    smoothScrollTo({ top: 900, durationMs: 300 });
    assert.equal(isProgrammaticScrollRecent(50), true);
    env.dispatch('wheel', {});
    assert.equal(isSmoothScrollActive(), false);
    assert.equal(isProgrammaticScrollRecent(50), false);
  });
});
