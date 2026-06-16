export interface ImgFitOptions {
  selector?: string;
  urlAttribute?: string;
  altAttribute?: string;
  paramsAttribute?: string;
  baseAttribute?: string;
  fallbackAttribute?: string;
  fallbackSelector?: string;
  dpr?: boolean;
  observeResize?: boolean;
  resizeDebounceMs?: number;
  url?: string;
}

export declare class ImgFit {
  init(selectorOrOptions?: string | ImgFitOptions, options?: ImgFitOptions): this;
  watch(element: Element, options?: ImgFitOptions): this;
  unwatch(element: Element): this;
  getOptimalWidth(element: Element, options?: ImgFitOptions): number;
  buildUrl(element: Element, options?: ImgFitOptions): string;
  update(element: Element, options?: ImgFitOptions): this;
}

export declare function snapWidth(width: number): number;
export declare function applyDpr(width: number, dpr: number): number;
export declare function buildUrl(url: string, width: number, params?: string): string;

declare const imgFit: ImgFit;
export default imgFit;
