import assert from 'assert';
import { snapWidth, applyDpr } from '../src/snap.js';
import { buildUrl } from '../src/url.js';

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(error.message);
    process.exitCode = 1;
  }
}

// snapWidth
test('snapWidth returns 0 for non-finite values', () => {
  assert.strictEqual(snapWidth(0), 0);
  assert.strictEqual(snapWidth(-10), 0);
  assert.strictEqual(snapWidth(NaN), 0);
});

test('snapWidth rounds below 300 to the next 20px', () => {
  assert.strictEqual(snapWidth(1), 20);
  assert.strictEqual(snapWidth(20), 20);
  assert.strictEqual(snapWidth(21), 40);
  assert.strictEqual(snapWidth(299), 300);
});

test('snapWidth rounds 300–1000 to the next 50px', () => {
  assert.strictEqual(snapWidth(300), 300);
  assert.strictEqual(snapWidth(301), 350);
  assert.strictEqual(snapWidth(1000), 1000);
});

test('snapWidth rounds above 1000 to the next 250px', () => {
  assert.strictEqual(snapWidth(1001), 1250);
  assert.strictEqual(snapWidth(1200), 1250);
  assert.strictEqual(snapWidth(2500), 2500);
});

// applyDpr
test('applyDpr snaps width even when dpr is disabled', () => {
  assert.strictEqual(applyDpr(200, 1), 200);
  assert.strictEqual(applyDpr(200, 0), 200);
  assert.strictEqual(applyDpr(180.328125, 1), 200);
  assert.strictEqual(applyDpr(360.65625, 1), 400);
});

test('applyDpr multiplies and re-snaps width', () => {
  assert.strictEqual(applyDpr(150, 2), 300);
  assert.strictEqual(applyDpr(160, 2), 350);
  assert.strictEqual(applyDpr(600, 2), 1250);
});

// buildUrl
test('buildUrl returns empty string when url is empty', () => {
  assert.strictEqual(buildUrl('', 800), '');
});

test('buildUrl appends rs param', () => {
  assert.strictEqual(
    buildUrl('https://cdn.example.com/photo.jpg', 800),
    'https://cdn.example.com/photo.jpg?rs=800'
  );
});

test('buildUrl merges existing params', () => {
  assert.strictEqual(
    buildUrl('https://cdn.example.com/photo.jpg?v=2', 800),
    'https://cdn.example.com/photo.jpg?v=2&rs=800'
  );
});

test('buildUrl merges extra params string', () => {
  assert.strictEqual(
    buildUrl('https://cdn.example.com/photo.jpg', 800, 'f=webp&q=80'),
    'https://cdn.example.com/photo.jpg?f=webp&q=80&rs=800'
  );
});

test('buildUrl width always wins over extra rs param', () => {
  assert.strictEqual(
    buildUrl('https://cdn.example.com/photo.jpg', 800, 'rs=200'),
    'https://cdn.example.com/photo.jpg?rs=800'
  );
});

console.log('');
console.log('All tests completed.');
