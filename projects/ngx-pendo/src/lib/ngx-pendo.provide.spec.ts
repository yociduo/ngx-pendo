import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { NgxPendoService } from './ngx-pendo.service';
import { provideNgxPendo } from './ngx-pendo.provide';

describe('provideNgxPendo', () => {
  let spyOnFormatter: Mock;

  beforeEach(() => {
    spyOnFormatter = vi.fn();
  });

  it('should provide NgxPendoService using provideAppInitializer', async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideNgxPendo({ pendoApiKey: 'test-api-key', pendoIdFormatter: spyOnFormatter })
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
        provideNgxPendo({
          pendoApiKey: 'test-api-key',
          pendoInitializerProvider: customProvider as unknown as Parameters<
            typeof provideNgxPendo
          >[0]['pendoInitializerProvider']
        })
      ]
    }).compileComponents();

    const service = TestBed.inject(NgxPendoService);
    expect(service).toBeTruthy();
  });
});
