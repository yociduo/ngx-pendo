import { APP_INITIALIZER } from '@angular/core';
import {
  pendoInitializer,
  NGX_PENDO_INITIALIZER_PROVIDER,
  NGX_PENDO_INITIALIZER_PROVIDER_V2
} from './ngx-pendo.injectors';
import { PendoWindow } from './ngx-pendo.types';

describe('pendoInitializer', () => {
  let mockWindow: PendoWindow;

  beforeEach(() => {
    mockWindow = { pendo: undefined } as unknown as PendoWindow;
  });

  it('should log error in dev mode when pendoApiKey is empty', async () => {
    const spyError = vi.spyOn(console, 'error');
    const initFn = pendoInitializer({ pendoApiKey: '' }, mockWindow);
    await initFn();
    expect(spyError).toHaveBeenCalledWith(
      'Empty api key for Pendo. Make sure to provide one when initializing NgxPendoModule.'
    );
    spyError.mockRestore();
  });

  it('should return early without error when pendoApiKey is empty', async () => {
    const initFn = pendoInitializer({ pendoApiKey: '' }, mockWindow);
    await expect(initFn()).resolves.toBeUndefined();
  });

  it('should load pendo script with default origin', async () => {
    const initFn = pendoInitializer({ pendoApiKey: 'test-key' }, mockWindow);
    const promise = initFn();

    const script = document.querySelector('script[src*="test-key"]') as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.async).toBe(true);
    expect(script.src).toContain('https://cdn.pendo.io/agent/static/test-key/pendo.js');

    mockWindow.pendo = {} as NonNullable<PendoWindow['pendo']>;
    script.dispatchEvent(new Event('load'));

    await promise;
    script.remove();
  });

  it('should load pendo script with custom origin', async () => {
    const initFn = pendoInitializer(
      { pendoApiKey: 'custom-key', pendoScriptOrigin: 'https://custom.cdn.com' },
      mockWindow
    );
    const promise = initFn();

    const script = document.querySelector('script[src*="custom-key"]') as HTMLScriptElement;
    expect(script.src).toContain('https://custom.cdn.com/agent/static/custom-key/pendo.js');

    mockWindow.pendo = {} as NonNullable<PendoWindow['pendo']>;
    script.dispatchEvent(new Event('load'));

    await promise;
    script.remove();
  });

  it('should handle script load error (e.g. ad blocker)', async () => {
    const spyError = vi.spyOn(console, 'error');
    const initFn = pendoInitializer({ pendoApiKey: 'blocked-key' }, mockWindow);
    const promise = initFn();

    const script = document.querySelector('script[src*="blocked-key"]') as HTMLScriptElement;
    script.dispatchEvent(new Event('error'));

    await promise;
    expect(spyError).toHaveBeenCalledWith('The pendo script may have been blocked.');
    spyError.mockRestore();
    script.remove();
  });

  it('should resolve and warn when the agent never becomes available', async () => {
    vi.useFakeTimers();
    const spyError = vi.spyOn(console, 'error');
    const initFn = pendoInitializer({ pendoApiKey: 'stuck-key', pendoLoadTimeout: 500 }, mockWindow);
    const promise = initFn();

    const script = document.querySelector('script[src*="stuck-key"]') as HTMLScriptElement;
    // Script loads, but window.pendo is never assigned.
    script.dispatchEvent(new Event('load'));

    await vi.advanceTimersByTimeAsync(600);
    await expect(promise).resolves.toBeUndefined();

    expect(spyError).toHaveBeenCalledWith(
      'Pendo agent did not become available within 500ms. Application will continue without Pendo.'
    );

    // The polling interval must have been torn down, not left running.
    expect(vi.getTimerCount()).toBe(0);

    spyError.mockRestore();
    vi.useRealTimers();
    script.remove();
  });

  it('should not emit the timeout warning when the agent arrives in time', async () => {
    vi.useFakeTimers();
    const spyError = vi.spyOn(console, 'error');
    const initFn = pendoInitializer({ pendoApiKey: 'fast-key', pendoLoadTimeout: 5000 }, mockWindow);
    const promise = initFn();

    const script = document.querySelector('script[src*="fast-key"]') as HTMLScriptElement;
    script.dispatchEvent(new Event('load'));

    mockWindow.pendo = {} as NonNullable<PendoWindow['pendo']>;
    await vi.advanceTimersByTimeAsync(150);
    await expect(promise).resolves.toBeUndefined();

    expect(spyError).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);

    spyError.mockRestore();
    vi.useRealTimers();
    script.remove();
  });
});

describe('NGX_PENDO_INITIALIZER_PROVIDER', () => {
  it('should be a valid legacy APP_INITIALIZER provider', () => {
    const provider = NGX_PENDO_INITIALIZER_PROVIDER as unknown as { provide: unknown; multi: boolean };
    expect(provider.provide).toBe(APP_INITIALIZER);
    expect(provider.multi).toBe(true);
  });
});

describe('NGX_PENDO_INITIALIZER_PROVIDER_V2', () => {
  it('should be an EnvironmentProviders instance', () => {
    expect(NGX_PENDO_INITIALIZER_PROVIDER_V2).toBeTruthy();
  });
});
