import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import ImgFit from '@danilo.riedel/img-fit';

@Directive({
  selector: '[imgFit]'
})
export class ImgFitDirective implements OnInit, OnDestroy {
  @Input('imgFit') src: string = '';
  @Input() imgFitParams: string = '';
  @Input() imgFitOptions: object = {};

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
  }

  ngOnDestroy(): void {
    ImgFit.unwatch(this.el.nativeElement);
  }
}

export default ImgFitDirective;
