import assert from 'assert';
import { snapWidth, applyDpr } from '../src/snap.js';
import { buildUrl } from '../src/url.js';

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(error.message);
    process.exitCode = 1;
  }
}

// snapWidth
test('snapWidth returns 0 for non-finite values', () => {
  assert.strictEqual(snapWidth(0), 0);
  assert.strictEqual(snapWidth(-10), 0);
  assert.strictEqual(snapWidth(NaN), 0);
});

test('snapWidth rounds below 300 to the next 20px', () => {
  assert.strictEqual(snapWidth(1), 20);
  assert.strictEqual(snapWidth(20), 20);
  assert.strictEqual(snapWidth(21), 40);
  assert.strictEqual(snapWidth(299), 300);
});

test('snapWidth rounds 300–1000 to the next 50px', () => {
  assert.strictEqual(snapWidth(300), 300);
  assert.strictEqual(snapWidth(301), 350);
  assert.strictEqual(snapWidth(1000), 1000);
});

test('snapWidth rounds above 1000 to the next 250px', () => {
  assert.strictEqual(snapWidth(1001), 1250);
  assert.strictEqual(snapWidth(1200), 1250);
  assert.strictEqual(snapWidth(2500), 2500);
});

// applyDpr
test('applyDpr snaps width even when dpr is disabled', () => {
  assert.strictEqual(applyDpr(200, 1), 200);
  assert.strictEqual(applyDpr(200, 0), 200);
  assert.strictEqual(applyDpr(180.328125, 1), 200);
  assert.strictEqual(applyDpr(360.65625, 1), 400);
});

test('applyDpr multiplies and re-snaps width', () => {
  assert.strictEqual(applyDpr(150, 2), 300);
  assert.strictEqual(applyDpr(160, 2), 350);
  assert.strictEqual(applyDpr(600, 2), 1250);
});

// buildUrl
test('buildUrl returns empty string when url is empty', () => {
  assert.strictEqual(buildUrl('', 800), '');
});

test('buildUrl appends rs param', () => {
  assert.strictEqual(
    buildUrl('https://cdn.example.com/photo.jpg', 800),
    'https://cdn.example.com/photo.jpg?rs=800'
  );
});

test('buildUrl merges existing params', () => {
  assert.strictEqual(
    buildUrl('https://cdn.example.com/photo.jpg?v=2', 800),
    'https://cdn.example.com/photo.jpg?v=2&rs=800'
  );
});

test('buildUrl merges extra params string', () => {
  assert.strictEqual(
    buildUrl('https://cdn.example.com/photo.jpg', 800, 'f=webp&q=80'),
    'https://cdn.example.com/photo.jpg?f=webp&q=80&rs=800'
  );
});

test('buildUrl width always wins over extra rs param', () => {
  assert.strictEqual(
    buildUrl('https://cdn.example.com/photo.jpg', 800, 'rs=200'),
    'https://cdn.example.com/photo.jpg?rs=800'
  );
});

// ImgFit class tests
const observedElements = new Map();
const intersectionCallbacks = new Map();
let resizeCallbacks = [];
let debounceTimers = [];

class MockResizeObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
    resizeCallbacks.push(callback);
  }

  observe(element) {
    this.elements.add(element);
    observedElements.set(element, this);
  }

  unobserve(element) {
    this.elements.delete(element);
    observedElements.delete(element);
  }

  disconnect() {
    resizeCallbacks = resizeCallbacks.filter((cb) => cb !== this.callback);
    this.elements.forEach((element) => {
      observedElements.delete(element);
    });
    this.elements.clear();
  }

  static trigger(element) {
    const observer = observedElements.get(element);
    if (observer) {
      observer.callback();
    }
  }
}

class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.elements = new Set();
  }

  observe(element) {
    this.elements.add(element);
    intersectionCallbacks.set(element, this);
  }

  unobserve(element) {
    this.elements.delete(element);
    intersectionCallbacks.delete(element);
  }

  disconnect() {
    this.elements.forEach((element) => {
      intersectionCallbacks.delete(element);
    });
    this.elements.clear();
  }

  static trigger(element, isIntersecting = true) {
    const observer = intersectionCallbacks.get(element);
    if (observer) {
      observer.callback([{ target: element, isIntersecting }]);
    }
  }
}

function createMockElement(tagName, width, attributes = {}) {
  const element = {
    nodeType: 1,
    tagName,
    _width: width,
    _attrs: new Map(Object.entries(attributes)),
    getAttribute(name) {
      return this._attrs.get(name) || null;
    },
    setAttribute(name, value) {
      this._attrs.set(name, value);
    },
    removeAttribute(name) {
      this._attrs.delete(name);
    },
    getBoundingClientRect() {
      return { width: this._width };
    },
    closest() {
      return null;
    },
    parentElement: null,
    appendChild(child) {
      this._children = this._children || [];
      this._children.push(child);
    },
    querySelector() {
      return null;
    }
  };

  // <img> elements are never self-measured; resolveMeasurementTarget walks up to
  // the parent container. Give mock imgs a parent whose width mirrors _width so
  // that setting element._width in tests still drives the correct ?rs= value.
  if (tagName === 'IMG') {
    element.parentElement = {
      getBoundingClientRect() { return { width: element._width }; },
      parentElement: null,
    };
  }

  return element;
}

globalThis.window = {
  innerWidth: 1024,
  devicePixelRatio: 1,
  location: { href: 'http://localhost' },
  addEventListener() {},
  removeEventListener() {}
};
globalThis.document = {
  body: createMockElement('BODY', 1024),
  createElement(tagName) {
    return createMockElement(tagName.toUpperCase(), 0);
  }
};
globalThis.Node = { ELEMENT_NODE: 1 };
globalThis.ResizeObserver = MockResizeObserver;
globalThis.IntersectionObserver = MockIntersectionObserver;
globalThis.setTimeout = (fn, ms) => {
  const id = { fn, ms };
  debounceTimers.push(id);
  return id;
};
globalThis.clearTimeout = (id) => {
  debounceTimers = debounceTimers.filter((timer) => timer !== id);
};

const { ImgFit } = await import('../src/img-fit.js');

test('ImgFit.update applies src with rs param', () => {
  const element = createMockElement('IMG', 400, {
    'data-img-fit': 'https://cdn.example.com/photo.jpg'
  });
  const imgFit = new ImgFit();
  imgFit.update(element);

  assert.ok(element.src);
  assert.ok(element.src.includes('rs=400'));
});

test('ImgFit.watch observes element with ResizeObserver', () => {
  const element = createMockElement('IMG', 300, {
    'data-img-fit': 'https://cdn.example.com/photo.jpg'
  });
  const imgFit = new ImgFit();
  imgFit.watch(element);

  assert.ok(observedElements.has(element));
});

test('ImgFit.watch with loading=lazy creates IntersectionObserver', () => {
  const element = createMockElement('IMG', 0, {
    'data-img-fit': 'https://cdn.example.com/photo.jpg',
    loading: 'lazy'
  });
  const imgFit = new ImgFit();
  imgFit.watch(element);

  assert.ok(intersectionCallbacks.has(element));
});

test('IntersectionObserver updates src when lazy element becomes visible', () => {
  const element = createMockElement('IMG', 0, {
    'data-img-fit': 'https://cdn.example.com/photo.jpg',
    loading: 'lazy'
  });
  const imgFit = new ImgFit();
  imgFit.watch(element);

  element._width = 500;
  MockIntersectionObserver.trigger(element, true);

  assert.ok(element.src);
  assert.ok(element.src.includes('rs=500'));
});

test('ResizeObserver updates src when element resizes', () => {
  const element = createMockElement('IMG', 300, {
    'data-img-fit': 'https://cdn.example.com/photo.jpg'
  });
  const imgFit = new ImgFit();
  imgFit.watch(element, { resizeDebounceMs: 0 });

  element._width = 600;
  MockResizeObserver.trigger(element);

  assert.ok(element.src.includes('rs=600'));
});

test('resizeDebounceMs delays src update', () => {
  const element = createMockElement('IMG', 300, {
    'data-img-fit': 'https://cdn.example.com/photo.jpg'
  });
  const imgFit = new ImgFit();
  imgFit.watch(element, { resizeDebounceMs: 100 });

  element._width = 600;
  MockResizeObserver.trigger(element);

  assert.strictEqual(element.src.includes('rs=600'), false);
  assert.strictEqual(debounceTimers.length, 1);
});

test('ImgFit.unwatch disconnects observers', () => {
  const element = createMockElement('IMG', 300, {
    'data-img-fit': 'https://cdn.example.com/photo.jpg',
    loading: 'lazy'
  });
  const imgFit = new ImgFit();
  imgFit.watch(element);

  assert.ok(observedElements.has(element));
  assert.ok(intersectionCallbacks.has(element));

  imgFit.unwatch(element);

  assert.strictEqual(observedElements.has(element), false);
  assert.strictEqual(intersectionCallbacks.has(element), false);
});

console.log('');
console.log('All tests completed.');
