import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxPendoComponent } from './ngx-pendo.component';
import { NGX_PENDO_API_KEY_TOKEN, NGX_PENDO_INITIALIZER_PROVIDER } from './ngx-pendo.injectors';

@NgModule({
  declarations: [NgxPendoComponent],
  imports: [
  ],
  exports: [NgxPendoComponent]
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
