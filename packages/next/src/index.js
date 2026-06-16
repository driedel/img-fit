import React, { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image.js';
import ImgFitCore, { applyDpr, buildUrl as buildImgUrl } from '@danilo.riedel/img-fit';

const Image = NextImage.default || NextImage;

/**
 * Next.js Image wrapper that renders an optimized img-fwd URL.
 *
 * @param {object} props
 * @param {string} props.src
 * @param {string} [props.alt]
 * @param {string} [props.params]
 * @param {object} [props.options]
 */
export function ImgFitImage({ src, alt = '', params = '', options = {}, fill, sizes, ...rest }) {
  const containerRef = useRef(null);
  const [optimizedSrc, setOptimizedSrc] = useState(src);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return undefined;
    }

    element.setAttribute('data-img-fit', src);
    if (params) {
      element.setAttribute('data-img-fit-params', params);
    } else {
      element.removeAttribute('data-img-fit-params');
    }

    const updateSrc = () => {
      setOptimizedSrc(ImgFitCore.buildUrl(element, { ...options, url: src }));
    };

    updateSrc();

    let resizeObserver = null;
    let intersectionObserver = null;

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateSrc);
      resizeObserver.observe(element);
    }

    if (rest.loading === 'lazy' && typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              updateSrc();
              if (intersectionObserver) {
                intersectionObserver.disconnect();
              }
            }
          });
        },
        {
          rootMargin: options.lazyRootMargin || '50px',
          threshold: options.lazyThreshold || 0
        }
      );
      intersectionObserver.observe(element);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    };
  }, [src, params, JSON.stringify(options), fill, sizes, rest.loading]);

  const width = rest.width ? Number(rest.width) : 0;
  const dpr = options.dpr !== false ? window.devicePixelRatio || 1 : 1;

  let imageSrc = optimizedSrc;
  if (!fill && width > 0) {
    imageSrc = buildImgUrl(src, applyDpr(width, dpr), params);
  }

  return React.createElement('div', {
    ref: containerRef,
    style: { position: 'relative', width: '100%', height: '100%' }
  }, React.createElement(Image, {
    src: imageSrc,
    alt,
    fill,
    sizes: sizes || (fill ? '100vw' : undefined),
    ...rest
  }));
}

export default ImgFitImage;
