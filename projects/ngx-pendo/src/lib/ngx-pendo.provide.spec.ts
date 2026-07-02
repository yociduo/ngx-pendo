import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { NgxPendoService } from './ngx-pendo.service';
import { provideNgxPendoWithV2Initializer } from './ngx-pendo.provide';
import { NGX_PENDO_ANGULAR_MAJOR_VERSION } from './ngx-pendo.injectors';

describe('provideNgxPendoWithV2Initializer', () => {
  let spyOnFormatter: Mock;

  beforeEach(() => {
    spyOnFormatter = vi.fn();
  });

  it('should provide NgxPendoService using v2 initializer', async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideNgxPendoWithV2Initializer({ pendoApiKey: 'test-api-key', pendoIdFormatter: spyOnFormatter })
      ]
    }).compileComponents();

    const service = TestBed.inject(NgxPendoService);
    expect(service).toBeTruthy();

    service.formatPendoId('a', 'b');
    expect(spyOnFormatter).toHaveBeenCalledTimes(2);
  });

  it('should use custom pendoInitializerProvider when provided', async () => {
    const customProvider = {
      provide: 'CUSTOM_INITIALIZER',
      useValue: () => Promise.resolve()
    };

    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideNgxPendoWithV2Initializer({
          pendoApiKey: 'test-api-key',
          pendoInitializerProvider: customProvider as unknown as Parameters<
            typeof provideNgxPendoWithV2Initializer
          >[0]['pendoInitializerProvider']
        })
      ]
    }).compileComponents();

    const service = TestBed.inject(NgxPendoService);
    expect(service).toBeTruthy();
  });
});

describe('NGX_PENDO_ANGULAR_MAJOR_VERSION', () => {
  it('should be a number representing current Angular major version', () => {
    expect(NGX_PENDO_ANGULAR_MAJOR_VERSION).toBeGreaterThan(0);
    expect(typeof NGX_PENDO_ANGULAR_MAJOR_VERSION).toBe('number');
  });
});
