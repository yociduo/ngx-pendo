import { APP_INITIALIZER, InjectionToken, isDevMode, Provider } from '@angular/core';
import { IPendoSettings } from './ngx-pendo.interfaces';

export const NGX_PENDO_SETTINGS_TOKEN = new InjectionToken<IPendoSettings>('ngx-pendo-settings', {
  factory: () => ({ pendoApiKey: '' })
});

const DEFAULT_PENDO_SCRIPT_ORIGIN = 'https://cdn.pendo.io';

export const NGX_PENDO_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: pendoInitializer,
  deps: [
    NGX_PENDO_SETTINGS_TOKEN,
  ]
};

export function pendoInitializer($settings: IPendoSettings) {
  return () => {
    if (!$settings.pendoApiKey) {
      if (isDevMode()) {
        console.error('Empty api key for Pendo. Make sure to provide one when initializing NgxPendoModule.');
      }

      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `${$settings.pendoScriptOrigin || DEFAULT_PENDO_SCRIPT_ORIGIN}/agent/static/${$settings.pendoApiKey}/pendo.js`;
    document.body.appendChild(script);
  };
}
