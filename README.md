# img-fit

A tiny, dependency-free JavaScript library that picks the optimal image width for any rendered container and appends it to an [img-fwd](https://img-fwd.driedel.dev/) URL.

This repository is a monorepo containing the vanilla `img-fit` core and first-party adapters for React, Next.js, Angular and Vue.

## Packages

| Package | Description |
|---|---|
| [`@danilo.riedel/img-fit`](https://www.npmjs.com/package/@danilo.riedel/img-fit) | Vanilla JavaScript core. |
| [`@danilo.riedel/img-fit-react`](https://www.npmjs.com/package/@danilo.riedel/img-fit-react) | React component adapter. |
| [`@danilo.riedel/img-fit-next`](https://www.npmjs.com/package/@danilo.riedel/img-fit-next) | Next.js `Image` wrapper. |
| [`@danilo.riedel/img-fit-angular`](https://www.npmjs.com/package/@danilo.riedel/img-fit-angular) | Angular directive. |
| [`@danilo.riedel/img-fit-vue`](https://www.npmjs.com/package/@danilo.riedel/img-fit-vue) | Vue component adapter. |

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
npm install @danilo.riedel/img-fit-react
```

```jsx
import { ImgFit } from '@danilo.riedel/img-fit-react';

<ImgFit src="https://cdn.example.com/photo.jpg" alt="Photo" />
```

### Next.js

```bash
npm install @danilo.riedel/img-fit-next
```

```jsx
import { ImgFitImage } from '@danilo.riedel/img-fit-next';

<ImgFitImage src="https://cdn.example.com/photo.jpg" alt="Photo" fill />
```

### Angular

```bash
npm install @danilo.riedel/img-fit-angular
```

```html
<img [imgFit]="'https://cdn.example.com/photo.jpg'" alt="Photo" />
```

### Vue

```bash
npm install @danilo.riedel/img-fit-vue
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
