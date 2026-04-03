import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';

import { NgxPendoService } from './ngx-pendo.service';
import { NgxPendoModule } from './ngx-pendo.module';
import { IAccount, IPendo, IVisitor } from './ngx-pendo.interfaces';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';

describe('NgxPendoService', () => {
  const visitor: IVisitor = { id: 'visitor-id' };
  const account: IAccount = { id: 'account-id' };
  const ids = ['a', 'b', 'c'];
  let spyOnFormatter: Mock;
  let spyOnPendo: Partial<IPendo>;

  beforeEach(() => {
    spyOnFormatter = vi.fn();
    spyOnPendo = {
      initialize: vi.fn(),
      identify: vi.fn(),
      updateOptions: vi.fn(),
      teardown: vi.fn(),
      isAnonymousVisitor: vi.fn(),
      clearSession: vi.fn(),
      enableDebugging: vi.fn(),
      disableDebugging: vi.fn()
    };
    Object.assign(window, { pendo: spyOnPendo });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxPendoModule.forRoot({ pendoApiKey: 'pendo-api-key', pendoIdFormatter: spyOnFormatter })],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should call formatter methods', () => {
    const service = TestBed.inject(NgxPendoService);
    expect(service).toBeTruthy();
    service.formatPendoId(...ids);
    expect(spyOnFormatter).toHaveBeenCalledTimes(ids.length);
    ids.forEach(id => expect(spyOnFormatter).toHaveBeenCalledWith(id));
  });

  it('should not call formatter methods when override', () => {
    TestBed.overrideProvider(NGX_PENDO_SETTINGS_TOKEN, { useValue: {} });

    const service = TestBed.inject(NgxPendoService);
    expect(service).toBeTruthy();
    service.formatPendoId(...ids);
    expect(spyOnFormatter).not.toHaveBeenCalled();
  });

  it('should call pendo methods', () => {
    const service = TestBed.inject(NgxPendoService);
    expect(service).toBeTruthy();

    service.initialize({ visitor, account });
    service.initialize(visitor, account);
    expect(spyOnPendo.initialize).toHaveBeenCalledTimes(2);
    expect(spyOnPendo.initialize).toHaveBeenCalledWith({ visitor, account });
    expect(spyOnPendo.initialize).toHaveBeenCalledWith({ visitor, account });

    service.identify(visitor.id, account.id);
    service.identify(visitor, account);
    expect(spyOnPendo.identify).toHaveBeenCalledTimes(2);
    expect(spyOnPendo.identify).toHaveBeenCalledWith(visitor.id, account.id);
    expect(spyOnPendo.identify).toHaveBeenCalledWith({ visitor, account });

    service.updateOptions({});
    expect(spyOnPendo.updateOptions).toHaveBeenCalledTimes(1);
    expect(spyOnPendo.updateOptions).toHaveBeenCalledWith({});

    service.teardown();
    expect(spyOnPendo.teardown).toHaveBeenCalledTimes(1);
    expect(spyOnPendo.teardown).toHaveBeenCalledWith();

    service.isAnonymousVisitor(visitor.id);
    service.isAnonymousVisitor();
    expect(spyOnPendo.isAnonymousVisitor).toHaveBeenCalledTimes(2);
    expect(spyOnPendo.isAnonymousVisitor).toHaveBeenCalledWith(visitor.id);

    service.clearSession();
    expect(spyOnPendo.clearSession).toHaveBeenCalledTimes(1);
    expect(spyOnPendo.clearSession).toHaveBeenCalledWith();

    service.enableDebugging();
    expect(spyOnPendo.enableDebugging).toHaveBeenCalledTimes(1);
    expect(spyOnPendo.enableDebugging).toHaveBeenCalledWith();

    service.disableDebugging();
    expect(spyOnPendo.disableDebugging).toHaveBeenCalledTimes(1);
    expect(spyOnPendo.disableDebugging).toHaveBeenCalledWith();
  });
});
