import * as React from 'react';

export interface ImgFitProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  params?: string;
  options?: object;
}

export function ImgFit(props: ImgFitProps): React.ReactElement;
export default ImgFit;
