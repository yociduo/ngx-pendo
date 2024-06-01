import { TestBed } from '@angular/core/testing';

import { NgxPendoService } from './ngx-pendo.service';
import { NgxPendoModule } from './ngx-pendo.module';
import { IAccount, IPendo, IVisitor } from './ngx-pendo.interfaces';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';

describe('NgxPendoService', () => {
  const visitor: IVisitor = { id: 'visitor-id' };
  const account: IAccount = { id: 'account-id' };
  const ids = ['a', 'b', 'c'];
  let spyOnFormatter: jasmine.Spy;
  let spyOnPendo: jasmine.SpyObj<IPendo>;

  beforeEach(() => {
    spyOnFormatter = jasmine.createSpy<(pendoId: string) => string>();
    spyOnPendo = jasmine.createSpyObj<IPendo>([
      'initialize',
      'identify',
      'updateOptions',
      'teardown',
      'enableDebugging',
      'disableDebugging'
    ]);
    Object.assign(window, { pendo: spyOnPendo });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxPendoModule.forRoot({ pendoApiKey: 'pendo-api-key', pendoIdFormatter: spyOnFormatter })]
    });
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
    expect(spyOnPendo.updateOptions).toHaveBeenCalledOnceWith({});

    service.teardown();
    expect(spyOnPendo.teardown).toHaveBeenCalledOnceWith();

    service.enableDebugging();
    expect(spyOnPendo.enableDebugging).toHaveBeenCalledOnceWith();

    service.disableDebugging();
    expect(spyOnPendo.disableDebugging).toHaveBeenCalledOnceWith();
  });
});
