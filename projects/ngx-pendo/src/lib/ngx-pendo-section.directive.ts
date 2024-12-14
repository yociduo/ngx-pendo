import { Directive, input, computed, signal, contentChildren, effect } from '@angular/core';
import { IPendoDirective } from './ngx-pendo.interfaces';
import { NgxPendoIdDirective } from './ngx-pendo-id.directive';

@Directive({
  selector: '[ngx-pendo-section]',
  standalone: true,
  host: {
    '[attr.data-pendo-section]': 'pendoSection()',
    '[attr.ngx-pendo-disable-inherit]': 'disableInherit()'
  }
})
export class NgxPendoSectionDirective implements IPendoDirective {
  pendoSection = input<string>('', { alias: 'ngx-pendo-section' });

  inherit = input<boolean>(true, { alias: 'ngx-pendo-inherit' });

  parent = signal<NgxPendoSectionDirective | undefined>(undefined);

  idDirectives = contentChildren(NgxPendoIdDirective, { descendants: false });

  sectionDirectivs = contentChildren(NgxPendoSectionDirective, { descendants: false });

  disableInherit = computed<boolean | undefined>(() => (this.inherit() ? undefined : true));

  constructor() {
    effect(() => {
      [...this.idDirectives(), ...this.sectionDirectivs()].forEach(item => {
        if (item !== this) {
          item.parent.set(this);
        }
      });
    });
  }
}
