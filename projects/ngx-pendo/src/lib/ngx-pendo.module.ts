import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxPendoComponent } from './ngx-pendo.component';
import { NGX_PENDO_SETTINGS_TOKEN, NGX_PENDO_INITIALIZER_PROVIDER } from './ngx-pendo.injectors';
import { NgxPendoIdDirective } from './ngx-pendo-id.directive';
import { NgxPendoSectionDirective } from './ngx-pendo-section.directive';
import { IPendoSettings } from './ngx-pendo.interfaces';
import { NgxPendoService } from './ngx-pendo.service';

@NgModule({
  declarations: [
    NgxPendoComponent,
    NgxPendoIdDirective,
    NgxPendoSectionDirective,
  ],
  imports: [],
  exports: [
    NgxPendoComponent,
    NgxPendoIdDirective,
    NgxPendoSectionDirective,
  ],
})
export class NgxPendoModule {
  static forRoot(settings: IPendoSettings): ModuleWithProviders<NgxPendoModule> {
    return {
      ngModule: NgxPendoModule,
      providers: [
        {
          provide: NGX_PENDO_SETTINGS_TOKEN,
          useValue: settings
        },
        NGX_PENDO_INITIALIZER_PROVIDER,
        NgxPendoService,
      ],
    };
  }

  static forChild(): ModuleWithProviders<NgxPendoModule> {
    return {
      ngModule: NgxPendoModule,
      providers: [
        NgxPendoService,
      ],
    };
  }
}
