# @danilo.riedel/img-fit-vue

Vue 3 adapter for [img-fit](https://github.com/driedel/img-fit).

## Installation

```bash
npm install @danilo.riedel/img-fit-vue
```

## Usage

```vue
<script setup>
import { ImgFit } from '@danilo.riedel/img-fit-vue';
</script>

<template>
  <ImgFit
    src="https://cdn.example.com/photo.jpg"
    alt="Photo"
    params="f=webp&q=80"
  />
</template>
```

## Props

| Prop | Type | Description |
|---|---|---|
| `src` | `string` | Original image URL. |
| `alt` | `string` | Image alt text. |
| `params` | `string` | Extra img-fwd parameters, e.g. `f=webp&q=80`. |
| `options` | `object` | Options passed to `ImgFit.watch()`. |

All other attributes are forwarded to the underlying `<img>` element.

## Notes

- The component renders the original `src` during SSR and hydration.
- The optimized `?rs=<width>` URL is applied on the client after the container is measured.
- Pass `loading="lazy"` and the core will recompute the URL via `IntersectionObserver` before the image loads.
