import { APP_INITIALIZER } from '@angular/core';
import {
  pendoInitializer,
  NGX_PENDO_INITIALIZER_PROVIDER,
  NGX_PENDO_ANGULAR_MAJOR_VERSION
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

  it('should return early without error when pendoApiKey is empty and no dev mode check passes', async () => {
    const initFn = pendoInitializer({ pendoApiKey: '' }, mockWindow);
    // Should resolve without throwing
    await expect(initFn()).resolves.toBeUndefined();
  });

  it('should load pendo script with default origin', async () => {
    const initFn = pendoInitializer({ pendoApiKey: 'test-key' }, mockWindow);
    const promise = initFn();

    // Find the injected script
    const script = document.querySelector('script[src*="test-key"]') as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.async).toBe(true);
    expect(script.src).toContain('https://cdn.pendo.io/agent/static/test-key/pendo.js');

    // Simulate pendo becoming available on window, then trigger onload
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

    // Simulate pendo becoming available
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
});

describe('NGX_PENDO_INITIALIZER_PROVIDER', () => {
  it('should be a valid APP_INITIALIZER provider', () => {
    expect(NGX_PENDO_INITIALIZER_PROVIDER).toBeTruthy();
    expect((NGX_PENDO_INITIALIZER_PROVIDER as Record<string, unknown>).provide).toBe(APP_INITIALIZER);
    expect((NGX_PENDO_INITIALIZER_PROVIDER as Record<string, unknown>).multi).toBe(true);
  });
});

describe('NGX_PENDO_ANGULAR_MAJOR_VERSION', () => {
  it('should be a positive integer', () => {
    expect(NGX_PENDO_ANGULAR_MAJOR_VERSION).toBeGreaterThan(0);
    expect(Number.isInteger(NGX_PENDO_ANGULAR_MAJOR_VERSION)).toBe(true);
  });
});
