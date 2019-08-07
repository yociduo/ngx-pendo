import { APP_INITIALIZER, InjectionToken, isDevMode, Provider } from '@angular/core';
import { IPendoSettings } from './ngx-pendo.interfaces';

export const NGX_PENDO_API_KEY_TOKEN = new InjectionToken<IPendoSettings>('ngx-pendo-settings', {
  factory: () => ({ pendoApiKey: '' })
});

export const NGX_PENDO_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: pendoInitializer,
  deps: [
    NGX_PENDO_API_KEY_TOKEN
  ]
}

export function pendoInitializer($settings: IPendoSettings) {
  return async () => {
    if (!$settings.pendoApiKey) {
      if (isDevMode()) {
        console.error('Empty api key for Pendo. Make sure to provide one when initializing NgxPendoModule.');
      }

      return;
    }

    console.log($settings);
  };
}
