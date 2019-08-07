import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngx-pendo-id]'
})
export class NgxPendoIdDirective {

  pendoId: string;

  @Input('ngx-pendo-id')
  @HostBinding('attr.data-pendo-id')
  get scrollbarHidden() { return this.pendoId; }
  set scrollbarHidden(value: string) { this.pendoId = value; }

  constructor() {
  }

}
