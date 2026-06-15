# img-fit + Next.js Example

Create a new Next.js app and install the adapter:

```bash
npx create-next-app@latest my-img-fit-app
cd my-img-fit-app
npm install @img-fit/next
```

Use the component in any page:

```jsx
import { ImgFitImage } from '@img-fit/next';

export default function Home() {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
      <ImgFitImage
        src="https://img-fwd.driedel.dev/images/photo.jpg"
        alt="Coastal landscape"
        fill
      />
    </div>
  );
}
```

Run the app:

```bash
npm run dev
```

Resize the browser and check the Network tab to see the generated `?rs=` values.
