function snapWidth(width) {
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

function applyDpr(width, dpr) {
  const ratio = dpr && dpr > 1 ? dpr : 1;
  return snapWidth(width * ratio);
}

function buildUrl(url, width, extraParams) {
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

const DEFAULT_OPTIONS = {
  selector: '[data-img-fit]',
  urlAttribute: 'data-img-fit',
  altAttribute: 'data-img-fit-alt',
  paramsAttribute: 'data-img-fit-params',
  baseAttribute: 'data-img-fit-base',
  fallbackAttribute: 'data-img-fit-fallback',
  dpr: true,
  observeResize: true,
  resizeDebounceMs: 100,
  lazy: true,
  lazyRootMargin: '50px',
  lazyThreshold: 0
};

function resolveOptions(options) {
  return { ...DEFAULT_OPTIONS, ...options };
}

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

function resolveUrl(element, options) {
  return (
    element.getAttribute(options.urlAttribute) ||
    element.getAttribute(options.fallbackAttribute) ||
    ''
  );
}

function resolveParams(element, options) {
  return element.getAttribute(options.paramsAttribute) || '';
}

function resolveAlt(element, options) {
  return element.getAttribute(options.altAttribute) || '';
}

function isLazyElement(element) {
  return element.getAttribute('loading') === 'lazy';
}

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

class ImgFit {
  constructor() {
    this.observers = new Map();
    this.resizeHandlers = new Map();
    this.intersectionObservers = new Map();
    this.debounceTimers = new Map();
  }

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

  _debouncedUpdate(element, options) {
    const ms = Number(options.resizeDebounceMs) || 0;

    if (ms <= 0) {
      return () => this.update(element, options);
    }

    return () => {
      const existing = this.debounceTimers.get(element);
      if (existing) {
        clearTimeout(existing);
      }

      const timer = setTimeout(() => {
        this.update(element, options);
        this.debounceTimers.delete(element);
      }, ms);

      this.debounceTimers.set(element, timer);
    };
  }

  watch(element, options) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return this;
    }

    const opts = resolveOptions(options);

    this.update(element, opts);

    this.unwatch(element);

    if (opts.observeResize) {
      const debouncedUpdate = this._debouncedUpdate(element, opts);

      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => {
          debouncedUpdate();
        });
        observer.observe(element);
        this.observers.set(element, observer);
      } else {
        const handler = () => debouncedUpdate();
        window.addEventListener('resize', handler);
        this.resizeHandlers.set(element, handler);
      }
    }

    if (opts.lazy !== false && isLazyElement(element)) {
      if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                this.update(element, opts);
                observer.disconnect();
                this.intersectionObservers.delete(element);
              }
            });
          },
          {
            rootMargin: opts.lazyRootMargin,
            threshold: opts.lazyThreshold
          }
        );
        observer.observe(element);
        this.intersectionObservers.set(element, observer);
      }
    }

    return this;
  }

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

    const intersectionObserver = this.intersectionObservers.get(element);
    if (intersectionObserver) {
      intersectionObserver.disconnect();
      this.intersectionObservers.delete(element);
    }

    const timer = this.debounceTimers.get(element);
    if (timer) {
      clearTimeout(timer);
      this.debounceTimers.delete(element);
    }

    return this;
  }

  getOptimalWidth(element, options) {
    const opts = resolveOptions(options);
    const target = resolveMeasurementTarget(element, opts);
    const rawWidth = readWidth(target) || window.innerWidth || 0;
    const dpr = opts.dpr ? window.devicePixelRatio || 1 : 1;

    return applyDpr(rawWidth, dpr);
  }

  buildUrl(element, options) {
    const opts = resolveOptions(options);
    const url = opts.url || resolveUrl(element, opts);
    const width = this.getOptimalWidth(element, opts);
    const params = resolveParams(element, opts);

    return buildUrl(url, width, params);
  }

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

const imgFit = new ImgFit();

module.exports = imgFit;
module.exports.ImgFit = ImgFit;
module.exports.default = imgFit;
module.exports.snapWidth = snapWidth;
module.exports.applyDpr = applyDpr;
module.exports.buildUrl = buildUrl;
