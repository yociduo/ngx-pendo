import { APP_INITIALIZER, InjectionToken, isDevMode, Provider } from '@angular/core';
import { interval } from 'rxjs';
import { IPendoSettings } from './ngx-pendo.interfaces';

export const NGX_PENDO_SETTINGS_TOKEN = new InjectionToken<IPendoSettings>('ngx-pendo-settings', {
  factory: () => ({ pendoApiKey: '', pendoScriptHost: 'https://cdn.pendo.io/' })
});

export const NGX_PENDO_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: pendoInitializer,
  deps: [
    NGX_PENDO_SETTINGS_TOKEN
  ]
};

export function pendoInitializer($settings: IPendoSettings) {
  return async () => {
    if (!$settings.pendoApiKey) {
      if (isDevMode()) {
        console.error('Empty api key for Pendo. Make sure to provide one when initializing NgxPendoModule.');
      }

      return;
    }

    await new Promise(resolve => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `${$settings.pendoScriptHost}/agent/static/${$settings.pendoApiKey}/pendo.js`;
      document.head.appendChild(script);
      script.onload = async () => {
        // when enableDebugging should load extra js
        const sub = interval(100).subscribe(() => {
          // tslint:disable-next-line: no-string-literal
          if (window['pendo']) {
            sub.unsubscribe();
            resolve();
          }
        });
      };
    });
  };
}
