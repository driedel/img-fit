# @danilo.riedel/img-fit-angular

Angular adapter for [img-fit](https://github.com/driedel/img-fit).

## Installation

```bash
npm install @danilo.riedel/img-fit-angular
```

## Usage

Import the directive into your module or standalone component:

```ts
import { ImgFitDirective } from '@danilo.riedel/img-fit-angular';

@Component({
  standalone: true,
  imports: [ImgFitDirective],
  template: `
    <img [imgFit]="'https://cdn.example.com/photo.jpg'" imgFitParams="f=webp&q=80" alt="Photo" />
  `
})
export class MyComponent {}
```

## Inputs

| Input | Type | Description |
|---|---|---|
| `imgFit` | `string` | Original image URL. |
| `imgFitParams` | `string` | Extra img-fwd parameters, e.g. `f=webp&q=80`. |
| `imgFitOptions` | `object` | Options passed to `ImgFit.watch()`. See table below. |

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `dpr` | `boolean` | `true` | Multiply the measured width by `window.devicePixelRatio`. |
| `observeResize` | `boolean` | `true` | Update the image when the container resizes. |
| `resizeDebounceMs` | `number` | `100` | Debounce delay (ms) for resize updates. |
| `lazy` | `boolean` | `true` | Recompute via `IntersectionObserver` for `loading="lazy"` images. |

All options from the core package are accepted. See [@danilo.riedel/img-fit](https://www.npmjs.com/package/@danilo.riedel/img-fit) for the full list.

## Retina / DPR

By default the directive multiplies the measured container width by `window.devicePixelRatio` before snapping to a breakpoint. A 560 px container on a 2× Retina display generates `?rs=1250` instead of `?rs=600`, keeping images crisp on every screen.

To request CSS pixel widths only:

```ts
@Component({
  template: `
    <img
      [imgFit]="url"
      [imgFitOptions]="{ dpr: false }"
      alt="Photo"
    />
  `
})
```

## Extra parameters

Append extra [img-fwd](https://img-fwd.driedel.dev/) transform parameters via the `imgFitParams` input. They are inserted before `?rs=` in the final URL:

```ts
// Result: https://cdn.example.com/photo.jpg?f=webp&q=80&rs=1250
@Component({
  template: `
    <img
      [imgFit]="url"
      imgFitParams="f=webp&q=80"
      alt="Photo"
    />
  `
})
```

## Notes

- The directive renders the original `src` during SSR and hydration.
- The optimized `?rs=<width>` URL is applied on the client after the container is measured.
- Add `loading="lazy"` to the host element and the core will recompute the URL via `IntersectionObserver` before the image loads.
