import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ImgFit from 'img-fit';

/**
 * Next.js Image wrapper that renders an optimized img-fwd URL.
 *
 * @param {object} props
 * @param {string} props.src
 * @param {string} [props.alt]
 * @param {string} [props.params]
 * @param {object} [props.options]
 */
export function ImgFitImage({ src, alt = '', params = '', options = {}, fill, ...rest }) {
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
      setOptimizedSrc(ImgFit.buildUrl(element, { ...options, url: src }));
    };

    updateSrc();

    const observer = new ResizeObserver(updateSrc);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [src, params, JSON.stringify(options)]);

  return React.createElement('div', {
    ref: containerRef,
    style: { position: 'relative', width: '100%', height: '100%' }
  }, React.createElement(Image, {
    src: optimizedSrc,
    alt,
    fill,
    ...rest
  }));
}

export default ImgFitImage;
