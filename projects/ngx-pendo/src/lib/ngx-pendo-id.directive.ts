import { AfterViewInit, Directive, ElementRef, HostBinding, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IPendoDirective } from './ngx-pendo.interfaces';
import { NgxPendoService } from './ngx-pendo.service';

@Directive({
  selector: '[ngx-pendo-id]'
})
export class NgxPendoIdDirective implements IPendoDirective, AfterViewInit, OnDestroy {

  private _timer: any;

  private _pendoSections: string[] = [];

  private _pendoId: string;

  @Input('ngx-pendo-id')
  @HostBinding('attr.data-pendo-id')
  get pendoId() { return this.service.formatPendoId(...this._pendoSections, this._pendoId); }
  set pendoId(value: string) { this._pendoId = value; }

  // tslint:disable-next-line: no-input-rename
  @Input('ngx-pendo-inherit')
  inherit = true;

  @HostBinding('attr.ngx-pendo-disable-inherit')
  get disableInherit() {
    return this.inherit ? undefined : true;
  }

  constructor(private service: NgxPendoService, private el: ElementRef, private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this._timer = setTimeout(() => {
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

  ngOnDestroy() {
    if (this._timer) {
      clearTimeout(this._timer);
    }
  }

}
