import './setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { render } from '@testing-library/react';
import { ImgFitImage } from '../src/index.js';

describe('ImgFitImage Next.js component', () => {
  it('renders a wrapper containing an img', () => {
    const { container } = render(
      React.createElement(ImgFitImage, {
        src: 'https://cdn.example.com/photo.jpg',
        alt: 'Photo',
        width: 400,
        height: 300,
        unoptimized: true
      })
    );
    const wrapper = container.firstChild;
    assert.ok(wrapper);
    assert.equal(wrapper.tagName, 'DIV');
    assert.equal(wrapper.getAttribute('data-img-fit'), 'https://cdn.example.com/photo.jpg');
  });
});
