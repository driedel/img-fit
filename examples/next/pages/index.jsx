import { ImgFitImage } from '@img-fit/next';

export default function Home() {
  return (
    <main style={{ padding: '2rem', background: '#0d1117', color: '#e6edf3', minHeight: '100vh' }}>
      <h1>img-fit + Next.js</h1>
      <p>Resize the browser and check the Network tab.</p>

      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '12px', overflow: 'hidden' }}>
        <ImgFitImage
          src="https://img-fwd.driedel.dev/images/photo.jpg"
          alt="Coastal landscape"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </main>
  );
}
