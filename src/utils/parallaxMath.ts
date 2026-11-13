/**
 * Pure parallax math for InteriorHero background layers.
 * Computes a vertical translation in CSS pixels based on the hero element's
 * position relative to the viewport, clamped to [-maxShift, maxShift] so the
 * oversized background image never reveals container edges.
 */
export function computeParallaxOffset(
  rectTop: number,
  rectHeight: number,
  viewportHeight: number,
  speedFactor = 0.28,
  maxShift = 96
): number {
  if (viewportHeight <= 0 || rectHeight <= 0) {
    return 0;
  }

  // Distance scrolled past top of document / hero center relative to viewport top
  const rawOffset = -rectTop * speedFactor;
  const clamped = Math.max(-maxShift, Math.min(maxShift, rawOffset));
  // Round to 2 decimal places for clean GPU transform strings and deterministic tests
  return Object.is(clamped, -0) ? 0 : Math.round(clamped * 100) / 100;
}

/**
 * Deterministic hash selector so each city or article slug maps consistently
 * to one of the curated architectural interior hero backgrounds.
 */
export function selectHeroIndexBySlug(slug: string, poolSize: number): number {
  if (poolSize <= 1) return 0;
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash % poolSize;
}
