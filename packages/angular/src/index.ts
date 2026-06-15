import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import ImgFit from 'img-fit';

@Directive({
  selector: '[imgFit]'
})
export class ImgFitDirective implements OnInit, OnDestroy {
  @Input('imgFit') src: string = '';
  @Input() imgFitParams: string = '';
  @Input() imgFitOptions: object = {};

  private observer: ResizeObserver | null = null;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;
    if (!element) {
      return;
    }

    element.setAttribute('data-img-fit', this.src);
    if (this.imgFitParams) {
      element.setAttribute('data-img-fit-params', this.imgFitParams);
    }

    ImgFit.watch(element, this.imgFitOptions);

    this.observer = new ResizeObserver(() => {
      ImgFit.update(element, this.imgFitOptions);
    });
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    ImgFit.unwatch(this.el.nativeElement);
  }
}

export default ImgFitDirective;
