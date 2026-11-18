import { clampSlideIndex, getNextSlideIndex, getPrevSlideIndex } from './parallaxMath';

export const TESTIMONIAL_AUTOPLAY_MS = 6000;
export const MAX_FRAME_DELTA_MS = 250;

/**
 * Computes normalized [0, 1] horizontal scale factor for the countdown bar
 * (1 = full time remaining, 0 = timer expired / advancing to next slide).
 */
export function computeCountdownScale(remainingMs: number, durationMs = TESTIMONIAL_AUTOPLAY_MS): number {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return 0;
  if (!Number.isFinite(remainingMs)) return 1;
  const ratio = Math.max(0, Math.min(1, remainingMs / durationMs));
  return Math.round(ratio * 10000) / 10000;
}

export interface StepTimerInput {
  currentIndex: number;
  totalSlides: number;
  remainingMs: number;
  deltaMs: number;
  durationMs?: number;
  isPaused: boolean;
}

export interface StepTimerResult {
  nextIndex: number;
  nextRemainingMs: number;
  didAdvance: boolean;
}

/**
 * Pure state-machine step for testimonial autoplay + countdown progression.
 * Clamps frame delta so returning from an inactive browser tab never skips multiple slides.
 */
export function stepTestimonialTimer({
  currentIndex,
  totalSlides,
  remainingMs,
  deltaMs,
  durationMs = TESTIMONIAL_AUTOPLAY_MS,
  isPaused,
}: StepTimerInput): StepTimerResult {
  const safeCurrent = clampSlideIndex(currentIndex, totalSlides);
  if (isPaused || totalSlides <= 1 || durationMs <= 0) {
    return {
      nextIndex: safeCurrent,
      nextRemainingMs: Math.max(0, Math.min(durationMs, remainingMs)),
      didAdvance: false,
    };
  }

  const safeDelta = Number.isFinite(deltaMs)
    ? Math.max(0, Math.min(MAX_FRAME_DELTA_MS, deltaMs))
    : 0;
  const updatedRemaining = remainingMs - safeDelta;

  if (updatedRemaining <= 0) {
    return {
      nextIndex: getNextSlideIndex(safeCurrent, totalSlides),
      nextRemainingMs: durationMs,
      didAdvance: true,
    };
  }

  return {
    nextIndex: safeCurrent,
    nextRemainingMs: updatedRemaining,
    didAdvance: false,
  };
}

/**
 * Determines swipe direction for touch gestures on the testimonial slider viewport.
 */
export function resolveSwipeDirection(
  startX: number,
  endX: number,
  thresholdPx = 44
): 'next' | 'prev' | null {
  if (!Number.isFinite(startX) || !Number.isFinite(endX)) return null;
  const deltaX = startX - endX;
  if (deltaX >= thresholdPx) return 'next';
  if (deltaX <= -thresholdPx) return 'prev';
  return null;
}

/**
 * Returns next index given a navigation action ('next', 'prev', or direct dot index).
 */
export function resolveSlideNavigation(
  currentIndex: number,
  totalSlides: number,
  action: { type: 'next' } | { type: 'prev' } | { type: 'goto'; index: number }
): number {
  if (action.type === 'next') return getNextSlideIndex(currentIndex, totalSlides);
  if (action.type === 'prev') return getPrevSlideIndex(currentIndex, totalSlides);
  return clampSlideIndex(action.index, totalSlides);
}

/**
 * Builds a clean 2-character monogram for a testimonial author without punctuation noise.
 */
export function getAuthorInitials(author: string): string {
  const words = author
    .replace(/[^a-zA-Z\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  if (words.length === 0) return 'SF';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}
