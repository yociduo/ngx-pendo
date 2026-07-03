import { makeEnvironmentProviders } from '@angular/core';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';
import { NGX_PENDO_INITIALIZER_PROVIDER_V2 } from './ngx-pendo.injectors';
import { IPendoSettings } from './ngx-pendo.interfaces';

/**
 * Provides the ngx-pendo library for Angular applications
 * Uses the modern `provideAppInitializer` API (Angular 22+)
 */
export function provideNgxPendo(settings: IPendoSettings) {
  return makeEnvironmentProviders([
    {
      provide: NGX_PENDO_SETTINGS_TOKEN,
      useValue: settings
    },
    settings.pendoInitializerProvider || NGX_PENDO_INITIALIZER_PROVIDER_V2
  ]);
}
