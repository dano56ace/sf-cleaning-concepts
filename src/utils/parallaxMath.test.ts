import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeParallaxOffset,
  clampSlideIndex,
  getNextSlideIndex,
  getPrevSlideIndex,
} from './parallaxMath';

test('clampSlideIndex wraps negative and overflow indices across 6 slides', () => {
  assert.equal(clampSlideIndex(0, 6), 0);
  assert.equal(clampSlideIndex(5, 6), 5);
  assert.equal(clampSlideIndex(6, 6), 0);
  assert.equal(clampSlideIndex(-1, 6), 5);
  assert.equal(clampSlideIndex(0, 0), 0);
});

test('getNextSlideIndex and getPrevSlideIndex cycle seamlessly through 6 service slides', () => {
  assert.equal(getNextSlideIndex(0, 6), 1);
  assert.equal(getNextSlideIndex(4, 6), 5);
  assert.equal(getNextSlideIndex(5, 6), 0);

  assert.equal(getPrevSlideIndex(0, 6), 5);
  assert.equal(getPrevSlideIndex(3, 6), 2);
});

test('computeParallaxOffset shifts smoothly with scroll and clamps within bounds', () => {
  assert.equal(computeParallaxOffset(0, 760, 900, 0.3, 108), 0);
  assert.equal(computeParallaxOffset(-300, 760, 900, 0.3, 108), 90);
  assert.equal(computeParallaxOffset(-600, 760, 900, 0.3, 108), 108);
});
