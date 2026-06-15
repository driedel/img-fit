import { DefineComponent } from 'vue';

export interface ImgFitProps {
  src: string;
  alt?: string;
  params?: string;
  options?: object;
}

export const ImgFit: DefineComponent<ImgFitProps>;
export default ImgFit;
