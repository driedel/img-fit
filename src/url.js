/**
 * Build an img-fwd compatible URL with the given resized width and optional params.
 *
 * @param {string} url
 * @param {number} width
 * @param {string|Record<string, string>|URLSearchParams} [extraParams]
 * @returns {string}
 */
export function buildUrl(url, width, extraParams) {
  if (!url) {
    return '';
  }

  const base = typeof window !== 'undefined' && window.location ? window.location.href : undefined;
  const parsed = new URL(url, base);

  if (extraParams) {
    const params =
      typeof extraParams === 'string'
        ? new URLSearchParams(extraParams)
        : extraParams instanceof URLSearchParams
          ? extraParams
          : new URLSearchParams(extraParams);

    for (const [key, value] of params) {
      parsed.searchParams.set(key, value);
    }
  }

  if (width > 0) {
    parsed.searchParams.set('rs', String(width));
  }

  return parsed.toString();
}
