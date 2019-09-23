import { AfterViewInit, Directive, ElementRef, HostBinding, Input, ChangeDetectorRef } from '@angular/core';
import { NgxPendoService } from './ngx-pendo.service';

@Directive({
  selector: '[ngx-pendo-id]'
})
export class NgxPendoIdDirective implements AfterViewInit {

  private _pendoSections: string[] = [];

  private _pendoId: string;

  @Input('ngx-pendo-id')
  @HostBinding('attr.data-pendo-id')
  get pendoId() { return this.service.formatPendoId(...this._pendoSections, this._pendoId); }
  set pendoId(value: string) { this._pendoId = value; }

  constructor(private service: NgxPendoService, private el: ElementRef, private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this._pendoSections = [];
      let ele = this.el.nativeElement as HTMLElement;
      while (ele && !ele.hasAttribute('ngx-pendo-disable-inherit')) {
        if (ele.hasAttribute('ngx-pendo-section')) {
          this._pendoSections.unshift(ele.getAttribute('ngx-pendo-section'));
        }
        ele = ele.parentElement;
      }
      this.cdr.detectChanges();
    });
  }

}
