# @danilo.riedel/img-fit-react

React adapter for [img-fit](https://github.com/driedel/img-fit).

## Installation

```bash
npm install @danilo.riedel/img-fit-react
```

## Usage

```jsx
import { ImgFit } from '@danilo.riedel/img-fit-react';

function App() {
  return (
    <ImgFit
      src="https://cdn.example.com/photo.jpg"
      alt="Photo"
      params="f=webp&q=80"
    />
  );
}
```

## Props

| Prop | Type | Description |
|---|---|---|
| `src` | `string` | Original image URL. |
| `alt` | `string` | Image alt text. |
| `params` | `string` | Extra img-fwd parameters, e.g. `f=webp&q=80`. |
| `options` | `object` | Options passed to `ImgFit.watch()`. See table below. |

All other props are forwarded to the underlying `<img>` element.

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
<ImgFit
  src="https://cdn.example.com/photo.jpg"
  alt="Photo"
  options={{ dpr: false }}
/>
```

## Extra parameters

Append extra [img-fwd](https://img-fwd.driedel.dev/) transform parameters via the `params` prop. They are inserted before `?rs=` in the final URL:

```jsx
// Result: https://cdn.example.com/photo.jpg?f=webp&q=80&rs=1250
<ImgFit
  src="https://cdn.example.com/photo.jpg"
  alt="Photo"
  params="f=webp&q=80"
/>
```

## Notes

- The component renders the original `src` during SSR and hydration.
- The optimized `?rs=<width>` URL is applied on the client after the container is measured.
- Pass `loading="lazy"` and the core will recompute the URL via `IntersectionObserver` before the image loads.
