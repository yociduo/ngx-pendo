import { Directive, Input, HostBinding } from '@angular/core';
import { IPendoDirective } from './ngx-pendo.interfaces';

@Directive({
  selector: '[ngx-pendo-section]'
})
export class NgxPendoSectionDirective implements IPendoDirective {

  @Input('ngx-pendo-section')
  @HostBinding('attr.ngx-pendo-section')
  pendoSection: string;

  // tslint:disable-next-line: no-input-rename
  @Input('ngx-pendo-inherit')
  inherit = true;

  @HostBinding('attr.ngx-pendo-disable-inherit')
  get disableInherit() {
    return this.inherit ? undefined : true;
  }

  constructor() { }

}
