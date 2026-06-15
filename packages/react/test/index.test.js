import './setup.js';
import { test } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { render } from '@testing-library/react';
import { ImgFit } from '../src/index.js';

test('ImgFit renders an img element with the original src', () => {
  const { container } = render(
    React.createElement(ImgFit, {
      src: 'https://cdn.example.com/photo.jpg',
      alt: 'Photo'
    })
  );

  const img = container.querySelector('img');
  assert.ok(img, 'img element should be rendered');
  assert.strictEqual(img.alt, 'Photo');
  assert.strictEqual(img.getAttribute('data-img-fit'), 'https://cdn.example.com/photo.jpg');
});

test('ImgFit appends data-img-fit-params when provided', () => {
  const { container } = render(
    React.createElement(ImgFit, {
      src: 'https://cdn.example.com/photo.jpg',
      params: 'f=webp&q=80'
    })
  );

  const img = container.querySelector('img');
  assert.strictEqual(img.getAttribute('data-img-fit-params'), 'f=webp&q=80');
});
