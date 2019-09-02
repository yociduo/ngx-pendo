import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngx-pendo-section]'
})
export class NgxPendoSectionDirective {

  @Input('ngx-pendo-section')
  @HostBinding('attr.ngx-pendo-section')
  pendoSection: string;

  constructor() { }

}
