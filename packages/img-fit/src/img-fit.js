import { snapWidth, applyDpr } from './snap.js';
import { buildUrl } from './url.js';

const DEFAULT_OPTIONS = {
  selector: '[data-img-fit]',
  urlAttribute: 'data-img-fit',
  altAttribute: 'data-img-fit-alt',
  paramsAttribute: 'data-img-fit-params',
  baseAttribute: 'data-img-fit-base',
  fallbackAttribute: 'data-img-fit-fallback',
  fallbackSelector: 'body',
  dpr: true,
  observeResize: true,
  resizeDebounceMs: 0
};

/**
 * Merge user options with defaults.
 *
 * @param {object} options
 * @returns {object}
 */
function resolveOptions(options) {
  return { ...DEFAULT_OPTIONS, ...options };
}

/**
 * Find the element whose width should be measured.
 * Falls back through: explicit base selector -> element itself -> parent with width -> body -> window.
 *
 * @param {Element} element
 * @param {object} options
 * @returns {Element}
 */
function resolveMeasurementTarget(element, options) {
  const baseSelector = element.getAttribute(options.baseAttribute);

  if (baseSelector) {
    const base = element.closest(baseSelector);
    if (base) {
      return base;
    }
  }

  if (element.getBoundingClientRect().width > 0) {
    return element;
  }

  let parent = element.parentElement;
  while (parent) {
    if (parent.getBoundingClientRect().width > 0) {
      return parent;
    }
    parent = parent.parentElement;
  }

  if (typeof document !== 'undefined' && document.body) {
    return document.body;
  }

  return null;
}

/**
 * Read the available width from a measurement target.
 *
 * @param {Element} target
 * @returns {number}
 */
function readWidth(target) {
  if (!target) {
    return 0;
  }

  if (target === window) {
    return window.innerWidth || 0;
  }

  if (target.getBoundingClientRect) {
    return target.getBoundingClientRect().width || 0;
  }

  return 0;
}

/**
 * Resolve the original image URL for an element.
 *
 * @param {Element} element
 * @param {object} options
 * @returns {string}
 */
function resolveUrl(element, options) {
  return (
    element.getAttribute(options.urlAttribute) ||
    element.getAttribute(options.fallbackAttribute) ||
    ''
  );
}

/**
 * Resolve extra img-fwd params for an element.
 *
 * @param {Element} element
 * @param {object} options
 * @returns {string}
 */
function resolveParams(element, options) {
  return element.getAttribute(options.paramsAttribute) || '';
}

/**
 * Resolve alt text for an injected image.
 *
 * @param {Element} element
 * @param {object} options
 * @returns {string}
 */
function resolveAlt(element, options) {
  return element.getAttribute(options.altAttribute) || '';
}

/**
 * Apply the generated URL to the element.
 * If the element is an <img>, set src directly. Otherwise inject an <img> child.
 *
 * @param {Element} element
 * @param {string} url
 * @param {object} options
 */
function applyImage(element, url, options) {
  if (!url) {
    return;
  }

  if (element.tagName === 'IMG') {
    element.src = url;
    return;
  }

  let img = element.querySelector('img[data-img-fit-rendered]');

  if (!img) {
    img = document.createElement('img');
    img.setAttribute('data-img-fit-rendered', '');
    img.alt = resolveAlt(element, options);
    element.appendChild(img);
  }

  img.src = url;
}

/**
 * img-fit core class.
 */
export class ImgFit {
  constructor() {
    /** @type {Map<Element, ResizeObserver>} */
    this.observers = new Map();
    /** @type {Map<Element, function>} */
    this.resizeHandlers = new Map();
  }

  /**
   * Initialize img-fit on all matching elements in the document.
   *
   * @param {string|object} [selectorOrOptions]
   * @param {object} [options]
   * @returns {ImgFit}
   */
  init(selectorOrOptions, options) {
    let selector = DEFAULT_OPTIONS.selector;
    let opts = {};

    if (typeof selectorOrOptions === 'string') {
      selector = selectorOrOptions;
      opts = options || {};
    } else if (selectorOrOptions && typeof selectorOrOptions === 'object') {
      opts = selectorOrOptions;
      if (opts.selector) {
        selector = opts.selector;
      }
    }

    const resolvedOpts = resolveOptions(opts);

    if (typeof document === 'undefined') {
      return this;
    }

    const elements = Array.from(document.querySelectorAll(selector));
    elements.forEach((element) => this.watch(element, resolvedOpts));

    return this;
  }

  /**
   * Watch a single element and keep its image source optimized.
   *
   * @param {Element} element
   * @param {object} [options]
   * @returns {ImgFit}
   */
  watch(element, options) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return this;
    }

    const opts = resolveOptions(options);
    const target = resolveMeasurementTarget(element, opts);

    this.update(element, opts);

    if (!opts.observeResize) {
      return this;
    }

    this.unwatch(element);

    if (typeof ResizeObserver !== 'undefined' && target && target !== window) {
      const observer = new ResizeObserver(() => {
        this.update(element, opts);
      });
      observer.observe(target);
      this.observers.set(element, observer);
    } else {
      const handler = () => this.update(element, opts);
      window.addEventListener('resize', handler);
      this.resizeHandlers.set(element, handler);
    }

    return this;
  }

  /**
   * Stop watching an element.
   *
   * @param {Element} element
   * @returns {ImgFit}
   */
  unwatch(element) {
    const observer = this.observers.get(element);
    if (observer) {
      observer.disconnect();
      this.observers.delete(element);
    }

    const handler = this.resizeHandlers.get(element);
    if (handler) {
      window.removeEventListener('resize', handler);
      this.resizeHandlers.delete(element);
    }

    return this;
  }

  /**
   * Compute the optimal snapped width for an element.
   *
   * @param {Element} element
   * @param {object} [options]
   * @returns {number}
   */
  getOptimalWidth(element, options) {
    const opts = resolveOptions(options);
    const target = resolveMeasurementTarget(element, opts);
    const rawWidth = readWidth(target) || window.innerWidth || 0;
    const dpr = opts.dpr ? window.devicePixelRatio || 1 : 1;

    return applyDpr(rawWidth, dpr);
  }

  /**
   * Build the final img-fwd URL for an element.
   *
   * @param {Element} element
   * @param {object} [options]
   * @returns {string}
   */
  buildUrl(element, options) {
    const opts = resolveOptions(options);
    const url = opts.url || resolveUrl(element, opts);
    const width = this.getOptimalWidth(element, opts);
    const params = resolveParams(element, opts);

    return buildUrl(url, width, params);
  }

  /**
   * Update the image source for a single element.
   *
   * @param {Element} element
   * @param {object} [options]
   * @returns {ImgFit}
   */
  update(element, options) {
    const opts = resolveOptions(options);
    const url = opts.url || resolveUrl(element, opts);

    if (!url) {
      return this;
    }

    const width = this.getOptimalWidth(element, opts);
    const params = resolveParams(element, opts);
    const finalUrl = buildUrl(url, width, params);

    applyImage(element, finalUrl, opts);

    return this;
  }
}

/**
 * Default singleton instance exported for convenience.
 */
const imgFit = new ImgFit();

export { snapWidth, applyDpr, buildUrl };
export default imgFit;
