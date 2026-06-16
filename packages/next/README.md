# @danilo.riedel/img-fit-next

Next.js adapter for [img-fit](https://github.com/driedel/img-fit).

## Installation

```bash
npm install @danilo.riedel/img-fit-next
```

## Usage

```jsx
import { ImgFitImage } from '@danilo.riedel/img-fit-next';

function App() {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
      <ImgFitImage
        src="https://cdn.example.com/photo.jpg"
        alt="Photo"
        params="f=webp&q=80"
        fill
      />
    </div>
  );
}
```

> **Note:** When using the `fill` prop, the parent element must have `position: relative` and explicit dimensions (width + height or aspect-ratio). img-fit measures the parent to compute `?rs=`.

## Props

| Prop | Type | Description |
|---|---|---|
| `src` | `string` | Original image URL. |
| `alt` | `string` | Image alt text. |
| `params` | `string` | Extra img-fwd parameters, e.g. `f=webp&q=80`. |
| `options` | `object` | Options passed to img-fit. See table below. |

All other props are forwarded to `next/image`.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `dpr` | `boolean` | `true` | Multiply the measured width by `window.devicePixelRatio`. |
| `observeResize` | `boolean` | `true` | Update the image when the container resizes. |
| `resizeDebounceMs` | `number` | `100` | Debounce delay (ms) for resize updates. |
| `lazy` | `boolean` | `true` | Recompute via `IntersectionObserver` for `loading="lazy"` images. |

All options from the core package are accepted. See [@danilo.riedel/img-fit](https://www.npmjs.com/package/@danilo.riedel/img-fit) for the full list.

## Retina / DPR

By default the component multiplies the measured container width by `window.devicePixelRatio` before snapping to a breakpoint. A 560 px container on a 2× Retina display generates `?rs=1250` instead of `?rs=600`, keeping images crisp on every screen.

To request CSS pixel widths only:

```jsx
<ImgFitImage
  src="https://cdn.example.com/photo.jpg"
  alt="Photo"
  options={{ dpr: false }}
  fill
/>
```

## Extra parameters

Append extra [img-fwd](https://img-fwd.driedel.dev/) transform parameters via the `params` prop. They are inserted before `?rs=` in the final URL:

```jsx
// Result: https://cdn.example.com/photo.jpg?f=webp&q=80&rs=1250
<ImgFitImage
  src="https://cdn.example.com/photo.jpg"
  alt="Photo"
  params="f=webp&q=80"
  fill
/>
```

## Notes

- The component renders the original `src` during SSR and hydration.
- The optimized `?rs=<width>` URL is applied on the client after the container is measured via `useEffect`.
- When using `fill`, the parent element must have explicit dimensions so the adapter can compute `?rs=` correctly.
- Lazy images are recomputed via `IntersectionObserver` before they load.
