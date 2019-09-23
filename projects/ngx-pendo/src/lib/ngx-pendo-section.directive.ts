import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[ngx-pendo-section]'
})
export class NgxPendoSectionDirective {

  @Input('ngx-pendo-section')
  @HostBinding('attr.ngx-pendo-section')
  pendoSection: string;

  constructor() { }

}
