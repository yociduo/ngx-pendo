import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';
import { PendoWindow } from './ngx-pendo.types';
import { IPendo, IPendoSettings } from './ngx-pendo.interfaces';

export const NGX_PENDO_SETTINGS_TOKEN = new InjectionToken<IPendoSettings>('ngx-pendo-settings', {
  providedIn: 'root',
  factory: () => ({ pendoApiKey: '' })
});

export const NGX_PENDO_WINDOW = new InjectionToken<PendoWindow>('ngx-pendo-window', {
  providedIn: 'root',
  factory: () => {
    const { defaultView } = inject(DOCUMENT);

    if (!defaultView) {
      throw new Error('Window is not available');
    }

    return defaultView;
  }
});

export const NGX_PENDO_CONTEXT = new InjectionToken<IPendo>('ngx-pendo-context', {
  providedIn: 'root',
  factory: () => inject(NGX_PENDO_WINDOW).pendo!
});
