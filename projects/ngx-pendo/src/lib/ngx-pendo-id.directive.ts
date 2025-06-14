import { Directive, inject, input, computed, signal } from '@angular/core';
import { IPendoDirective } from './ngx-pendo.interfaces';
import { NgxPendoService } from './ngx-pendo.service';
import { NgxPendoSectionDirective } from './ngx-pendo-section.directive';

@Directive({
  selector: '[ngx-pendo-id]',
  standalone: true,
  host: {
    '[attr.data-pendo-id]': 'mergedPendoId()',
    '[attr.ngx-pendo-disable-inherit]': 'disableInherit()'
  }
})
export class NgxPendoIdDirective implements IPendoDirective {
  pendoId = input<string>('', { alias: 'ngx-pendo-id' });

  inherit = input<boolean>(true, { alias: 'ngx-pendo-inherit' });

  parent = signal<NgxPendoSectionDirective | undefined>(undefined);

  mergedPendoId = computed<string>(() => {
    const pendoSections = [];

    let cur = this.inherit() ? this.parent() : null;
    while (cur) {
      pendoSections.unshift(cur.pendoSection());
      cur = cur.inherit() ? cur.parent() : null;
    }

    return this.service.formatPendoId(...pendoSections, this.pendoId());
  });

  disableInherit = computed<boolean | undefined>(() => (this.inherit() ? undefined : true));

  service = inject(NgxPendoService);
}
