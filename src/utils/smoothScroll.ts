export interface SmoothScrollOptions {
  top: number;
  left?: number;
  behavior?: ScrollBehavior;
  durationMs?: number;
  onComplete?: () => void;
}

export interface ElementScrollTargetParams {
  rectTop: number;
  rectHeight: number;
  scrollY: number;
  innerHeight: number;
  scrollHeight: number;
  scrollMarginTop?: number;
  block?: 'start' | 'center';
}

export interface ScrollToElementOptions {
  block?: 'start' | 'center';
  behavior?: ScrollBehavior;
  durationMs?: number;
  onComplete?: () => void;
}

const INTERRUPT_KEY_SET = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
  'Escape',
]);

let activeRafId: number | null = null;
let cleanupInterruptListeners: (() => void) | null = null;
let activeGeneration = 0;
let lastProgrammaticScrollAt = 0;

function nowMs(): number {
  return typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();
}

export function easeInOutCubic(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

export function computeSmoothScrollDuration(distancePx: number): number {
  const absDistance = Math.abs(distancePx);
  if (absDistance < 1) return 0;
  return Math.min(360, Math.max(280, Math.round(absDistance * 0.3)));
}

export function computeElementTargetScrollY(params: ElementScrollTargetParams): number {
  const {
    rectTop,
    rectHeight,
    scrollY,
    innerHeight,
    scrollHeight,
    scrollMarginTop = 0,
    block = 'start',
  } = params;

  const maxScrollY = Math.max(0, scrollHeight - innerHeight);
  const rawTargetY =
    block === 'center'
      ? scrollY + rectTop + rectHeight / 2 - innerHeight / 2
      : scrollY + rectTop - scrollMarginTop;

  return Math.max(0, Math.min(Math.round(rawTargetY), maxScrollY));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function cancelSmoothScroll(): void {
  activeGeneration += 1;

  if (activeRafId !== null && typeof window !== 'undefined') {
    window.cancelAnimationFrame(activeRafId);
  }
  activeRafId = null;

  if (cleanupInterruptListeners !== null) {
    cleanupInterruptListeners();
    cleanupInterruptListeners = null;
  }
}

export function isSmoothScrollActive(): boolean {
  return activeRafId !== null;
}

export function isProgrammaticScrollRecent(withinMs = 50): boolean {
  if (isSmoothScrollActive()) return true;
  if (lastProgrammaticScrollAt <= 0) return false;
  return nowMs() - lastProgrammaticScrollAt < withinMs;
}

function attachInterruptListeners(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleInterrupt = () => {
    lastProgrammaticScrollAt = 0;
    cancelSmoothScroll();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (INTERRUPT_KEY_SET.has(e.key)) {
      lastProgrammaticScrollAt = 0;
      cancelSmoothScroll();
    }
  };

  window.addEventListener('wheel', handleInterrupt, { passive: true });
  window.addEventListener('touchstart', handleInterrupt, { passive: true });
  window.addEventListener('pointerdown', handleInterrupt, { passive: true });
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('wheel', handleInterrupt);
    window.removeEventListener('touchstart', handleInterrupt);
    window.removeEventListener('pointerdown', handleInterrupt);
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function smoothScrollTo(options: SmoothScrollOptions): void {
  cancelSmoothScroll();

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (!Number.isFinite(options.top)) {
    return;
  }

  const docHeight = Math.max(
    document.documentElement?.scrollHeight ?? 0,
    document.body?.scrollHeight ?? 0
  );
  const maxScrollY = Math.max(0, docHeight - window.innerHeight);
  const targetY = Math.max(0, Math.min(options.top, maxScrollY));
  const startY = window.scrollY;
  const targetX = options.left ?? window.scrollX;
  const distance = targetY - startY;

  if (
    options.behavior === 'instant' ||
    (options.durationMs !== undefined && options.durationMs <= 0) ||
    prefersReducedMotion() ||
    Math.abs(distance) < 1 ||
    typeof window.requestAnimationFrame !== 'function'
  ) {
    lastProgrammaticScrollAt = nowMs();
    window.scrollTo({ left: targetX, top: targetY, behavior: 'instant' });
    options.onComplete?.();
    return;
  }

  const generation = activeGeneration;
  const duration = options.durationMs ?? computeSmoothScrollDuration(distance);
  const startTime = nowMs();

  cleanupInterruptListeners = attachInterruptListeners();

  const step = (now: number) => {
    if (generation !== activeGeneration) return;

    const currentTime = typeof performance !== 'undefined' ? now : Date.now();
    const elapsed = Math.max(0, currentTime - startTime);
    const progress = duration > 0 ? Math.min(1, elapsed / duration) : 1;
    const eased = easeInOutCubic(progress);
    const nextY = progress >= 1 ? targetY : startY + distance * eased;

    lastProgrammaticScrollAt = nowMs();
    window.scrollTo({ left: targetX, top: nextY, behavior: 'instant' });

    if (generation !== activeGeneration) return;

    if (progress < 1) {
      activeRafId = window.requestAnimationFrame(step);
    } else {
      activeRafId = null;
      if (cleanupInterruptListeners !== null) {
        cleanupInterruptListeners();
        cleanupInterruptListeners = null;
      }
      options.onComplete?.();
    }
  };

  activeRafId = window.requestAnimationFrame(step);
}

export function smoothScrollToElement(
  target: HTMLElement,
  options: ScrollToElementOptions = {}
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const rect = target.getBoundingClientRect();
  const computed = window.getComputedStyle?.(target);
  const scrollMarginTop = computed ? parseFloat(computed.scrollMarginTop || '0') || 0 : 0;
  const scrollHeight = Math.max(
    document.documentElement?.scrollHeight ?? 0,
    document.body?.scrollHeight ?? 0
  );

  const targetY = computeElementTargetScrollY({
    rectTop: rect.top,
    rectHeight: rect.height,
    scrollY: window.scrollY,
    innerHeight: window.innerHeight,
    scrollHeight,
    scrollMarginTop,
    block: options.block ?? 'start',
  });

  smoothScrollTo({
    top: targetY,
    behavior: options.behavior,
    durationMs: options.durationMs,
    onComplete: options.onComplete,
  });
}
