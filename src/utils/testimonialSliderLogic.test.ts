import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TESTIMONIAL_AUTOPLAY_MS,
  computeCountdownScale,
  stepTestimonialTimer,
  resolveSwipeDirection,
  resolveSlideNavigation,
  getAuthorInitials,
} from './testimonialSliderLogic';

test('computeCountdownScale maps remaining time cleanly into [0, 1]', () => {
  assert.equal(computeCountdownScale(6000, 6000), 1);
  assert.equal(computeCountdownScale(3000, 6000), 0.5);
  assert.equal(computeCountdownScale(0, 6000), 0);
  assert.equal(computeCountdownScale(-150, 6000), 0);
  assert.equal(computeCountdownScale(9000, 6000), 1);
  assert.equal(computeCountdownScale(3000, 0), 0);
});

test('stepTestimonialTimer counts down when active, freezes when paused, and wraps around on expiry', () => {
  // Normal frame tick
  const tick1 = stepTestimonialTimer({
    currentIndex: 0,
    totalSlides: 7,
    remainingMs: 6000,
    deltaMs: 100,
    durationMs: 6000,
    isPaused: false,
  });
  assert.equal(tick1.nextIndex, 0);
  assert.equal(tick1.nextRemainingMs, 5900);
  assert.equal(tick1.didAdvance, false);

  // Paused state freezes countdown
  const pausedTick = stepTestimonialTimer({
    currentIndex: 2,
    totalSlides: 7,
    remainingMs: 3420,
    deltaMs: 100,
    durationMs: 6000,
    isPaused: true,
  });
  assert.equal(pausedTick.nextIndex, 2);
  assert.equal(pausedTick.nextRemainingMs, 3420);
  assert.equal(pausedTick.didAdvance, false);

  // Expiry advances to next slide and resets remainingMs to full duration
  const advanceTick = stepTestimonialTimer({
    currentIndex: 6,
    totalSlides: 7,
    remainingMs: 50,
    deltaMs: 80,
    durationMs: 6000,
    isPaused: false,
  });
  assert.equal(advanceTick.nextIndex, 0);
  assert.equal(advanceTick.nextRemainingMs, TESTIMONIAL_AUTOPLAY_MS);
  assert.equal(advanceTick.didAdvance, true);

  // Background tab delta is clamped to MAX_FRAME_DELTA_MS (250ms)
  const clampedTick = stepTestimonialTimer({
    currentIndex: 1,
    totalSlides: 7,
    remainingMs: 5000,
    deltaMs: 15000,
    durationMs: 6000,
    isPaused: false,
  });
  assert.equal(clampedTick.nextIndex, 1);
  assert.equal(clampedTick.nextRemainingMs, 4750);
  assert.equal(clampedTick.didAdvance, false);
});

test('resolveSwipeDirection and resolveSlideNavigation handle touch swipes and wrap-around dot/arrow navigation', () => {
  assert.equal(resolveSwipeDirection(300, 210), 'next');
  assert.equal(resolveSwipeDirection(150, 240), 'prev');
  assert.equal(resolveSwipeDirection(200, 180), null);

  assert.equal(resolveSlideNavigation(0, 7, { type: 'prev' }), 6);
  assert.equal(resolveSlideNavigation(6, 7, { type: 'next' }), 0);
  assert.equal(resolveSlideNavigation(2, 7, { type: 'goto', index: 4 }), 4);
});

test('getAuthorInitials produces clean two-letter monograms', () => {
  assert.equal(getAuthorInitials('Lindsey J. Crowley'), 'LC');
  assert.equal(getAuthorInitials('Elena & David Ross'), 'ER');
  assert.equal(getAuthorInitials('Adrian James'), 'AJ');
});
