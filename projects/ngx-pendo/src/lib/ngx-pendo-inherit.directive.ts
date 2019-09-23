import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[ngx-pendo-inherit]'
})
export class NgxPendoInheritDirective {

  @Input('ngx-pendo-inherit')
  inherit = true;

  @HostBinding('attr.ngx-pendo-disable-inherit')
  get disableInherit() {
    return this.inherit ? undefined : true;
  }

  constructor() { }

}
