import { APP_INITIALIZER, isDevMode, Provider } from '@angular/core';
import { interval } from 'rxjs';
import { IPendoSettings } from './ngx-pendo.interfaces';
import { NGX_PENDO_WINDOW, NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';
import { PendoWindow } from './ngx-pendo.types';

const DEFAULT_PENDO_SCRIPT_ORIGIN = 'https://cdn.pendo.io';

// export const NGX_PENDO_INITIALIZER_PROVIDER = provideAppInitializer(() => {
//   const initializerFn = pendoInitializer(inject(NGX_PENDO_SETTINGS_TOKEN), inject(NGX_PENDO_WINDOW));
//   return initializerFn();
// });

// Keep the `APP_INITIALIZER` to support angular 17 and 18 version
export const NGX_PENDO_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: pendoInitializer,
  deps: [NGX_PENDO_SETTINGS_TOKEN, NGX_PENDO_WINDOW]
};

export function pendoInitializer($settings: IPendoSettings, window: PendoWindow): () => Promise<void> {
  return async () => {
    const { pendoApiKey, pendoScriptOrigin } = $settings;
    if (!pendoApiKey) {
      if (isDevMode()) {
        console.error('Empty api key for Pendo. Make sure to provide one when initializing NgxPendoModule.');
      }

      return;
    }

    await new Promise<void>(resolve => {
      const script = document.createElement('script');
      script.async = true;
      script.src = `${pendoScriptOrigin || DEFAULT_PENDO_SCRIPT_ORIGIN}/agent/static/${pendoApiKey}/pendo.js`;
      document.head.appendChild(script);
      script.onerror = async () => {
        // The script may have been blocked by an ad blocker
        console.error('The pendo script may have been blocked.');
        resolve();
      };
      script.onload = async () => {
        // when enableDebugging should load extra js
        const sub = interval(100).subscribe(() => {
          if (window.pendo) {
            sub.unsubscribe();
            resolve();
          }
        });
      };
    });
  };
}
