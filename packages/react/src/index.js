import React, { useEffect, useRef } from 'react';
import ImgFitCore from 'img-fit';

/**
 * React component that renders an optimized <img> for img-fwd.
 *
 * @param {object} props
 * @param {string} props.src
 * @param {string} [props.alt]
 * @param {string} [props.params]
 * @param {object} [props.options]
 */
export function ImgFit({ src, alt = '', params = '', options = {}, ...rest }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const element = imgRef.current;
    if (!element) {
      return undefined;
    }

    element.setAttribute('data-img-fit', src);
    if (params) {
      element.setAttribute('data-img-fit-params', params);
    } else {
      element.removeAttribute('data-img-fit-params');
    }

    ImgFitCore.watch(element, options);

    return () => {
      ImgFitCore.unwatch(element);
    };
  }, [src, params, JSON.stringify(options)]);

  return React.createElement('img', {
    ref: imgRef,
    src,
    alt,
    'data-img-fit': src,
    'data-img-fit-params': params || undefined,
    ...rest
  });
}

export default ImgFit;
