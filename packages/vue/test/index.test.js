import './setup.js';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mount } from '@vue/test-utils';
import { ImgFit } from '../src/index.js';

describe('ImgFit Vue component', () => {
  it('renders an img with data-img-fit attribute', () => {
    const wrapper = mount(ImgFit, {
      props: {
        src: 'https://cdn.example.com/photo.jpg',
        alt: 'Photo'
      }
    });
    const img = wrapper.find('img');
    assert.ok(img.exists());
    assert.equal(img.attributes('data-img-fit'), 'https://cdn.example.com/photo.jpg');
    assert.equal(img.attributes('alt'), 'Photo');
  });
});
