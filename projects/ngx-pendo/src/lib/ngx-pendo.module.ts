import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxPendoComponent } from './ngx-pendo.component';
import { NgxPendoIdDirective } from './ngx-pendo-id.directive';
import { NgxPendoSectionDirective } from './ngx-pendo-section.directive';
import { NGX_PENDO_INITIALIZER_PROVIDER } from './ngx-pendo.injectors';
import { IPendoSettings } from './ngx-pendo.interfaces';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';

@NgModule({
  declarations: [NgxPendoComponent, NgxPendoIdDirective, NgxPendoSectionDirective],
  imports: [],
  exports: [NgxPendoComponent, NgxPendoIdDirective, NgxPendoSectionDirective]
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
        NGX_PENDO_INITIALIZER_PROVIDER
      ]
    };
  }

  static forChild(): ModuleWithProviders<NgxPendoModule> {
    return {
      ngModule: NgxPendoModule
    };
  }
}
