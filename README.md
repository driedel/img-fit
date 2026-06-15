# img-fit

A tiny, dependency-free JavaScript library that picks the optimal image width for any rendered container and appends it to an [img-fwd](https://img-fwd.driedel.dev/) URL.

This repository is a monorepo containing the vanilla `img-fit` core and first-party adapters for React, Next.js, Angular and Vue.

## Packages

| Package | Description |
|---|---|
| [`img-fit`](./packages/img-fit) | Vanilla JavaScript core. |
| [`@img-fit/react`](./packages/react) | React component adapter. |
| [`@img-fit/next`](./packages/next) | Next.js `Image` wrapper. |
| [`@img-fit/angular`](./packages/angular) | Angular directive. |
| [`@img-fit/vue`](./packages/vue) | Vue component adapter. |

## Quick start

### Vanilla JS

```bash
npm install img-fit
```

```html
<img data-img-fit="https://cdn.example.com/photo.jpg" alt="Photo" />
```

```js
import ImgFit from 'img-fit';

ImgFit.init();
```

### React

```bash
npm install @img-fit/react
```

```jsx
import { ImgFit } from '@img-fit/react';

<ImgFit src="https://cdn.example.com/photo.jpg" alt="Photo" />
```

### Next.js

```bash
npm install @img-fit/next
```

```jsx
import { ImgFitImage } from '@img-fit/next';

<ImgFitImage src="https://cdn.example.com/photo.jpg" alt="Photo" fill />
```

### Angular

```bash
npm install @img-fit/angular
```

```html
<img [imgFit]="'https://cdn.example.com/photo.jpg'" alt="Photo" />
```

### Vue

```bash
npm install @img-fit/vue
```

```vue
<ImgFit src="https://cdn.example.com/photo.jpg" alt="Photo" />
```

## Examples

See the `examples/` folder for runnable demos:

- [`examples/vanilla`](./examples/vanilla)
- [`examples/react`](./examples/react)
- [`examples/vue`](./examples/vue)
- [`examples/next`](./examples/next)
- [`examples/angular`](./examples/angular)

## Development

This project uses npm workspaces.

```bash
npm install
npm test
npm run build:angular
```

## License

MIT
