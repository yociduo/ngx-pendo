import {
  APP_INITIALIZER,
  inject,
  isDevMode,
  Provider,
  EnvironmentProviders,
  provideAppInitializer
} from '@angular/core';
import { interval } from 'rxjs';
import { IPendoSettings } from './ngx-pendo.interfaces';
import { NGX_PENDO_WINDOW, NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';
import { PendoWindow } from './ngx-pendo.types';

const DEFAULT_PENDO_SCRIPT_ORIGIN = 'https://cdn.pendo.io';

// Upper bound on how long we wait for the Pendo agent to attach itself to the
// window after the script reports `load`. Without this, a script that loads but
// never registers `window.pendo` (blocked CDN, proxy error page, corrupted
// response) would poll forever and never resolve the APP_INITIALIZER promise,
// hanging application bootstrap.
const DEFAULT_PENDO_LOAD_TIMEOUT = 10_000;
const PENDO_POLL_INTERVAL = 100;

// Legacy APP_INITIALIZER provider for module-based consumption (NgxPendoModule.forRoot)
// Kept for backward compatibility with module-based apps
export const NGX_PENDO_INITIALIZER_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: pendoInitializer,
  deps: [NGX_PENDO_SETTINGS_TOKEN, NGX_PENDO_WINDOW]
};

/**
 * Angular 22+ initializer using `provideAppInitializer` API
 * Used by default in `provideNgxPendo()` standalone API
 */
export const NGX_PENDO_INITIALIZER_PROVIDER_V2: EnvironmentProviders = provideAppInitializer(() => {
  const settings = inject(NGX_PENDO_SETTINGS_TOKEN);
  const window = inject(NGX_PENDO_WINDOW);
  return pendoInitializer(settings, window)();
});

export function pendoInitializer($settings: IPendoSettings, window: PendoWindow): () => Promise<void> {
  return async () => {
    const { pendoApiKey, pendoScriptOrigin } = $settings;
    if (!pendoApiKey) {
      if (isDevMode()) {
        console.error('Empty api key for Pendo. Make sure to provide one when initializing NgxPendoModule.');
      }

      return;
    }

    const loadTimeout = $settings.pendoLoadTimeout ?? DEFAULT_PENDO_LOAD_TIMEOUT;

    await new Promise<void>(resolve => {
      let settled = false;
      let pollSub: { unsubscribe: () => void } | undefined;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const settle = (): void => {
        if (settled) {
          return;
        }
        settled = true;
        pollSub?.unsubscribe();
        clearTimeout(timer);
        resolve();
      };

      const script = document.createElement('script');
      script.async = true;
      script.src = `${pendoScriptOrigin || DEFAULT_PENDO_SCRIPT_ORIGIN}/agent/static/${pendoApiKey}/pendo.js`;
      document.head.appendChild(script);
      script.onerror = () => {
        // The script may have been blocked by an ad blocker
        console.error('The pendo script may have been blocked.');
        settle();
      };
      script.onload = () => {
        // when enableDebugging should load extra js
        pollSub = interval(PENDO_POLL_INTERVAL).subscribe(() => {
          if (window.pendo) {
            settle();
          }
        });

        // Guard against the agent never appearing: resolve anyway so the
        // application can still bootstrap.
        timer = setTimeout(() => {
          if (!settled) {
            console.error(
              `Pendo agent did not become available within ${loadTimeout}ms. Application will continue without Pendo.`
            );
            settle();
          }
        }, loadTimeout);
      };
    });
  };
}
