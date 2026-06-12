import { makeEnvironmentProviders } from '@angular/core';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';
import { NGX_PENDO_INITIALIZER_PROVIDER, NGX_PENDO_INITIALIZER_PROVIDER_V2 } from './ngx-pendo.injectors';
import { IPendoSettings } from './ngx-pendo.interfaces';

/**
 * Provides the ngx-pendo library for Angular applications
 * Uses the legacy APP_INITIALIZER token for maximum compatibility (works with Angular 17+)
 */
export function provideNgxPendo(settings: IPendoSettings) {
  return makeEnvironmentProviders([
    {
      provide: NGX_PENDO_SETTINGS_TOKEN,
      useValue: settings
    },
    settings.pendoInitializerProvider || NGX_PENDO_INITIALIZER_PROVIDER
  ]);
}

/**
 * Provides the ngx-pendo library using the new Angular 22+ provideAppInitializer API
 * This API is more type-safe and aligns with modern Angular patterns
 * @note Only for Angular 22 and higher
 */
export function provideNgxPendoWithV2Initializer(settings: IPendoSettings) {
  return makeEnvironmentProviders([
    {
      provide: NGX_PENDO_SETTINGS_TOKEN,
      useValue: settings
    },
    settings.pendoInitializerProvider || NGX_PENDO_INITIALIZER_PROVIDER_V2
  ]);
}
