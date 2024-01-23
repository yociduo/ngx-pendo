import { makeEnvironmentProviders } from '@angular/core';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';
import { NGX_PENDO_INITIALIZER_PROVIDER } from './ngx-pendo.injectors';
import { IPendoSettings } from './ngx-pendo.interfaces';

export function provideNgxPendo(settings: IPendoSettings) {
  return makeEnvironmentProviders([
    {
      provide: NGX_PENDO_SETTINGS_TOKEN,
      useValue: settings
    },
    NGX_PENDO_INITIALIZER_PROVIDER
  ]);
}
