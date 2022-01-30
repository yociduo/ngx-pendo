import { Directive, Input, HostBinding } from '@angular/core';
import { IPendoDirective } from './ngx-pendo.interfaces';
import { NgxPendoService } from './ngx-pendo.service';
import { NgxPendoSectionDirective } from './ngx-pendo-section.directive';

@Directive({
  selector: '[ngx-pendo-id]'
})
export class NgxPendoIdDirective implements IPendoDirective {
  private _parent!: NgxPendoSectionDirective;

  private _pendoSections: string[] = [];

  private _pendoId!: string;

  @Input('ngx-pendo-id')
  @HostBinding('attr.data-pendo-id')
  get pendoId(): string {
    return this.service.formatPendoId(...this._pendoSections, this._pendoId);
  }
  set pendoId(value: string) {
    this._pendoId = value;
  }

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('ngx-pendo-inherit')
  inherit = true;

  get parent(): NgxPendoSectionDirective {
    return this._parent;
  }
  set parent(value: NgxPendoSectionDirective) {
    this._parent = value;
    setTimeout(() => {
      this._pendoSections = [];
      let cur = this.inherit ? value : null;
      while (cur) {
        this._pendoSections.unshift(cur.pendoSection);
        cur = cur.inherit ? cur.parent : null;
      }
    });
  }

  @HostBinding('attr.ngx-pendo-disable-inherit')
  get disableInherit(): boolean | undefined {
    return this.inherit ? undefined : true;
  }

  constructor(private service: NgxPendoService) {}
}
