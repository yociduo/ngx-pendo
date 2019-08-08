import { AfterViewInit, Directive, ElementRef, HostBinding, Input, ChangeDetectorRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngx-pendo-id]'
})
export class NgxPendoIdDirective implements AfterViewInit {

  // tslint:disable-next-line: variable-name
  private _pendoSections: string[] = [];

  // tslint:disable-next-line: variable-name
  private _pendoId: string;

  @Input('ngx-pendo-id')
  @HostBinding('attr.data-pendo-id')
  get pendoId() { return this._pendoSections.concat([this._pendoId]).join('.'); }
  set pendoId(value: string) { this._pendoId = value; }

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this._pendoSections = [];
    let ele = this.el.nativeElement as HTMLElement;
    while (ele) {
      if (ele.hasAttribute('ngx-pendo-section')) {
        this._pendoSections.push(ele.getAttribute('ngx-pendo-section'));
      }
      ele = ele.parentElement;
    }
    this.cdr.detectChanges();
  }

}
