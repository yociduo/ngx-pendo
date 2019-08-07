import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxPendoComponent } from './ngx-pendo.component';
import { NGX_PENDO_API_KEY_TOKEN, NGX_PENDO_INITIALIZER_PROVIDER } from './ngx-pendo.injectors';
import { NgxPendoIdDirective } from './ngx-pendo-id.directive';
import { NgxPendoSectionDirective } from './ngx-pendo-section.directive';

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
  ]
})
export class NgxPendoModule {
  static forRoot(pendoApiKey: string): ModuleWithProviders {
    return {
      ngModule: NgxPendoModule,
      providers: [
        {
          provide: NGX_PENDO_API_KEY_TOKEN,
          useValue: {
            pendoApiKey
          }
        },
        NGX_PENDO_INITIALIZER_PROVIDER,
      ]
    };
  }
}
