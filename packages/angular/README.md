# @img-fit/angular

Angular adapter for [img-fit](https://github.com/driedel/img-fit).

## Installation

```bash
npm install @img-fit/angular
```

## Usage

Import the directive into your module or standalone component:

```ts
import { ImgFitDirective } from '@img-fit/angular';

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
| `imgFitOptions` | `object` | Options passed to `ImgFit.watch()`. |

## Notes

- The directive renders the original `src` during SSR and hydration.
- The optimized `?rs=<width>` URL is applied on the client after the container is measured.
