import { Location } from '@angular/common';
import { Component, ModuleWithProviders, NgModule, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Route, Router, RouterModule } from '@angular/router';
import { NgxPendoModule } from './ngx-pendo.module';
import { NgxPendoService } from './ngx-pendo.service';
import { NGX_PENDO_SETTINGS_TOKEN } from './ngx-pendo.tokens';

@Component({
  template: `<router-outlet></router-outlet>`,
  standalone: false
})
class RootComponent {}

@Component({
  selector: 'ngx-pendo-lazy-loaded-parent',
  template: 'lazy-loaded-parent [<router-outlet></router-outlet>]',
  standalone: false
})
class ParentLazyLoadedComponent {}

function getLazyLoadedModule(importedModule: ModuleWithProviders<NgxPendoModule>) {
  @Component({
    selector: 'ngx-pendo-lazy-loaded-child',
    template: 'lazy-loaded-child',
    standalone: false
  })
  class ChildLazyLoadedComponent {}

  @NgModule({
    declarations: [ParentLazyLoadedComponent, ChildLazyLoadedComponent],
    imports: [
      RouterModule.forChild([
        {
          path: 'loaded',
          component: ParentLazyLoadedComponent,
          children: [{ path: 'child', component: ChildLazyLoadedComponent }]
        } as Route
      ]),
      importedModule
    ]
  })
  class LoadedModule {}

  return LoadedModule;
}

describe('NgxPendoModule', () => {
  let spyOnConsole: jasmine.Spy;
  let spyOnFormatter: jasmine.Spy;

  beforeEach(() => {
    spyOnConsole = spyOn(console, 'error');
    spyOnFormatter = jasmine.createSpy<(pendoId: string) => string>();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NgxPendoModule.forRoot({ pendoApiKey: 'pendo-api-key', pendoIdFormatter: spyOnFormatter })
      ],
      declarations: [RootComponent],
      providers: [provideZonelessChangeDetection()]
    });
  });

  it('should work when passed the normal options', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const root = fixture.componentInstance;
    expect(root).toBeTruthy();
    expect(spyOnConsole).not.toHaveBeenCalled();

    const service = TestBed.inject(NgxPendoService);
    expect(service).toBeTruthy();
    const ids = ['a', 'b', 'c'];
    service.formatPendoId(...ids);
    expect(spyOnFormatter).toHaveBeenCalledTimes(ids.length);
    ids.forEach(id => expect(spyOnFormatter).toHaveBeenCalledWith(id));
  });

  it('should log error when pendo api key is empty', () => {
    TestBed.overrideProvider(NGX_PENDO_SETTINGS_TOKEN, {});
    const fixture = TestBed.createComponent(RootComponent);
    const root = fixture.componentInstance;
    expect(root).toBeTruthy();
    expect(spyOnConsole).toHaveBeenCalled();
  });

  it('should work when lazy loaded using forChild', async () => {
    const router = TestBed.inject(Router);
    const location = TestBed.inject(Location);
    const service = TestBed.inject(NgxPendoService);

    const fixture = TestBed.createComponent(RootComponent);
    router.initialNavigation();
    await fixture.whenStable();

    const ids = ['a', 'b', 'c'];
    service.formatPendoId(...ids);
    expect(spyOnFormatter).toHaveBeenCalledTimes(ids.length);
    ids.forEach(id => expect(spyOnFormatter).toHaveBeenCalledWith(id));

    const LoadedModule = getLazyLoadedModule(NgxPendoModule.forChild());
    router.resetConfig([{ path: 'lazy', loadChildren: () => LoadedModule }]);
    router.navigateByUrl('/lazy/loaded/child');
    await fixture.whenStable();

    expect(location.path()).toEqual('/lazy/loaded/child');

    spyOnFormatter.calls.reset();
    service.formatPendoId(...ids);
    expect(spyOnFormatter).toHaveBeenCalledTimes(ids.length);
  });
});
