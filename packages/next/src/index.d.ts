import * as React from 'react';
import { ImageProps } from 'next/image';

export interface ImgFitImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt?: string;
  params?: string;
  options?: object;
}

export function ImgFitImage(props: ImgFitImageProps): React.ReactElement;
export default ImgFitImage;
