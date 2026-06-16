# img-fit

A tiny, dependency-free JavaScript library that picks the optimal image width for any rendered container and appends it to an [img-fwd](https://img-fwd.driedel.dev/) URL.

Instead of hard-coding `?rs=800` in your HTML, add `data-img-fit` and let the browser measure the real space available after CSS has been applied.

## Why?

[img-fwd](https://img-fwd.driedel.dev/) resizes images on the fly with the `?rs=<width>` query parameter. Choosing the right width is usually a guessing game:

- Hard-coding one width wastes bandwidth on small screens.
- Hard-coding many breakpoints is repetitive and error-prone.

`img-fit` bridges that gap: it reads the rendered container size, snaps it to a cache-friendly breakpoint, and writes the correct `?rs=<width>` value for you.

## Installation

```bash
npm install @danilo.riedel/img-fit
```

## Quick start

### 1. Add the attribute

```html
<img data-img-fit="https://cdn.example.com/photo.jpg" alt="Photo" />
```

### 2. Initialize

```js
import ImgFit from '@danilo.riedel/img-fit';

ImgFit.init();
```

That is it. The library measures the image container, picks a width, and sets:

```html
<img src="https://cdn.example.com/photo.jpg?rs=800" alt="Photo" />
```

## HTML usage

You can place `data-img-fit` directly on an `<img>` or on any wrapper element. When used on a wrapper, `img-fit` injects an `<img>` inside it.

```html
<!-- Existing image element with extra CDN parameters -->
<!-- Result: https://cdn.example.com/photo.jpg?f=webp&q=80&rs=800 -->
<img
  data-img-fit="https://cdn.example.com/photo.jpg"
  data-img-fit-params="f=webp&q=80"
  alt="Photo"
/>

<!-- Wrapper element — img-fit injects an <img> inside -->
<div
  data-img-fit="https://cdn.example.com/photo.jpg"
  data-img-fit-alt="Photo"
  data-img-fit-params="f=avif"
></div>

<!-- Explicit measurement base — measure .card width instead of the img itself -->
<div class="card">
  <img
    data-img-fit="https://cdn.example.com/photo.jpg"
    data-img-fit-base=".card"
    alt="Photo"
  />
</div>

<!-- Fallback URL when data-img-fit may be empty -->
<img
  data-img-fit-fallback="https://cdn.example.com/placeholder.jpg"
  alt="Photo"
/>
```

### Data attributes

| Attribute | Description |
|---|---|
| `data-img-fit` | Original image URL. |
| `data-img-fit-alt` | `alt` text for images injected into wrapper elements. |
| `data-img-fit-params` | Extra img-fwd parameters, e.g. `f=webp&q=80`. |
| `data-img-fit-base` | CSS selector of an ancestor to measure when the element itself has no width. |
| `data-img-fit-fallback` | Fallback URL when `data-img-fit` is empty. |

## JavaScript API

### `ImgFit.init(selector?, options?)`

Scan the document and start watching every matching element.

```js
ImgFit.init();

// Custom selector and options
ImgFit.init('[data-img-fit]', { dpr: false });
```

### `ImgFit.watch(element, options?)`

Watch a single element programmatically. The `url` option lets you supply the image URL in JavaScript rather than via a `data-img-fit` attribute.

```js
const hero = document.querySelector('#hero');
ImgFit.watch(hero, {
  url: 'https://cdn.example.com/hero.jpg',
  dpr: false
});
```

### `ImgFit.unwatch(element)`

Stop watching an element and disconnect its resize observer.

```js
ImgFit.unwatch(hero);
```

### `ImgFit.getOptimalWidth(element, options?)`

Return the snapped width that would be requested for an element.

```js
const width = ImgFit.getOptimalWidth(hero);
console.log(width); // 800
```

### `ImgFit.buildUrl(element, options?)`

Return the full URL that would be assigned to an element.

```js
const url = ImgFit.buildUrl(hero);
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `selector` | `string` | `'[data-img-fit]'` | Selector used by `init()`. |
| `urlAttribute` | `string` | `'data-img-fit'` | Attribute that holds the image URL. |
| `altAttribute` | `string` | `'data-img-fit-alt'` | Attribute that holds injected image `alt` text. |
| `paramsAttribute` | `string` | `'data-img-fit-params'` | Attribute that holds extra img-fwd params. |
| `baseAttribute` | `string` | `'data-img-fit-base'` | Attribute that holds a measurement-base selector. |
| `fallbackAttribute` | `string` | `'data-img-fit-fallback'` | Attribute that holds a fallback URL. |
| `dpr` | `boolean` | `true` | Multiply the measured width by `window.devicePixelRatio`. |
| `observeResize` | `boolean` | `true` | Update the image when the container resizes. |
| `resizeDebounceMs` | `number` | `100` | Debounce delay for resize updates. |
| `lazy` | `boolean` | `true` | Watch `loading="lazy"` images with `IntersectionObserver` and recompute before they load. |
| `lazyRootMargin` | `string` | `'50px'` | Root margin for the lazy-load `IntersectionObserver`. |
| `lazyThreshold` | `number` | `0` | Visibility threshold for the lazy-load `IntersectionObserver`. |

## Width snapping

Exact container widths would fragment caches, so `img-fit` snaps every value up to a breakpoint:

| Range | Step |
|---|---|
| `< 300 px` | `20 px` |
| `300 px – 1000 px` | `50 px` |
| `> 1000 px` | `250 px` |

These helpers are exported if you need them elsewhere:

```js
import { snapWidth, applyDpr } from '@danilo.riedel/img-fit';

snapWidth(260); // 260
snapWidth(265); // 280
applyDpr(400, 2); // 800
```

## Device pixel ratio

Devices like MacBook Retina, iPhone, and AMOLED phones report a `devicePixelRatio` greater than 1 — they pack 2 or 3 physical pixels into every CSS pixel. By default (`dpr: true`) `img-fit` multiplies the container width by `window.devicePixelRatio` before snapping, so every screen gets a sharp image without any extra config.

**Concrete examples:**

| Container (CSS px) | DPR | Raw width | After snap | `?rs=` generated |
|---|---|---|---|---|
| 560 px | 1× | 560 | 600 | `?rs=600` |
| 560 px | 2× | 1 120 | 1 250 | `?rs=1250` |
| 260 px | 2× | 520 | 550 | `?rs=550` |
| 260 px | 3× | 780 | 800 | `?rs=800` |

To request CSS pixel widths only (disables DPR multiplication):

```js
ImgFit.init({ dpr: false });
```

Or per-element via `watch()`:

```js
ImgFit.watch(element, { dpr: false });
```

## Lazy loading

Images with `loading="lazy"` are tricky because the browser may not lay them out until they are close to the viewport. `img-fit` solves this by registering an `IntersectionObserver` for every lazy image. When the image is about to become visible, the URL is recomputed using the element's real rendered size, so the requested `?rs=` value is correct.

```html
<img
  data-img-fit="https://cdn.example.com/photo.jpg"
  loading="lazy"
  alt="Photo"
/>
```

You can disable this behavior per element or globally:

```js
ImgFit.init({ lazy: false });
```

## Integration with img-fwd

`img-fit` only adds the `?rs=<width>` query string. All other transformation parameters (`f`, `q`, `g`, `blur`, etc.) are passed through untouched.

```html
<img
  data-img-fit="https://cdn.example.com/photo.jpg"
  data-img-fit-params="f=webp&q=80"
/>
```

Result:

```html
<img src="https://cdn.example.com/photo.jpg?f=webp&q=80&rs=800" />
```

Point your DNS or application to an [img-fwd](https://img-fwd.driedel.dev/) proxy and the image will be resized and optimized automatically.

## Example

See the live vanilla example in `examples/vanilla/`:

```bash
npx serve examples/vanilla
```

Then open the browser DevTools Network tab and resize the window. You will see each image request a different `?rs=` value based on its rendered container.

## Framework support

`img-fit` is vanilla JavaScript so it works in any stack. Framework-specific adapters are also available:

- `@danilo.riedel/img-fit-react`
- `@danilo.riedel/img-fit-next`
- `@danilo.riedel/img-fit-angular`
- `@danilo.riedel/img-fit-vue`

## Browser support

`img-fit` uses `ResizeObserver` and `IntersectionObserver` when available and falls back to `window.resize` events. It works in all modern browsers. Internet Explorer is not supported.

## License

MIT
