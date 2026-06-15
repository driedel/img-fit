# @img-fit/next

Next.js adapter for [img-fit](https://github.com/driedel/img-fit).

## Installation

```bash
npm install @img-fit/next
```

## Usage

```jsx
import { ImgFitImage } from '@img-fit/next';

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

## Props

| Prop | Type | Description |
|---|---|---|
| `src` | `string` | Original image URL. |
| `alt` | `string` | Image alt text. |
| `params` | `string` | Extra img-fwd parameters, e.g. `f=webp&q=80`. |
| `options` | `object` | Options passed to img-fit. |

All other props are forwarded to `next/image`.

## Notes

- The component renders the original `src` during SSR and hydration.
- The optimized `?rs=<width>` URL is applied on the client after the container is measured.
- The component wraps `next/image` with a `position: relative` container.
