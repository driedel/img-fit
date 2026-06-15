/**
 * Default width snapping grid used to improve CDN cache reuse.
 *
 * - width < 300 px  -> step 20 px
 * - 300 <= width <= 1000 px -> step 50 px
 * - width > 1000 px -> step 250 px
 *
 * @param {number} width
 * @returns {number}
 */
export function snapWidth(width) {
  if (!Number.isFinite(width) || width <= 0) {
    return 0;
  }

  if (width < 300) {
    return Math.ceil(width / 20) * 20;
  }

  if (width <= 1000) {
    return Math.ceil(width / 50) * 50;
  }

  return Math.ceil(width / 250) * 250;
}

/**
 * Applies device pixel ratio to a width and snaps the result.
 * Even when DPR is disabled or equal to 1, the returned width is always
 * rounded up to the next grid value to keep cache-friendly sizes.
 *
 * @param {number} width
 * @param {number} dpr
 * @returns {number}
 */
export function applyDpr(width, dpr) {
  const ratio = dpr && dpr > 1 ? dpr : 1;
  return snapWidth(width * ratio);
}
