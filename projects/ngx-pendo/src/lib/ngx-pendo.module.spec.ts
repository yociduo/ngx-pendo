import { Location } from '@angular/common';
import { Component, ModuleWithProviders, NgModule } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPendoModule } from './ngx-pendo.module';
import { Route, Router, RouterModule } from '@angular/router';
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

function getLazyLoadedModule(importedModule: ModuleWithProviders<{}>) {
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
        <Route>{
          path: 'loaded',
          component: ParentLazyLoadedComponent,
          children: [{ path: 'child', component: ChildLazyLoadedComponent }]
        }
      ]),
      importedModule
    ]
  })
  class LoadedModule {}

  return LoadedModule;
}

function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

function createRoot(router: Router, type: any): ComponentFixture<any> {
  const f = TestBed.createComponent(type);
  advance(f);
  router.initialNavigation();
  advance(f);
  return f;
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
        RouterTestingModule,
        NgxPendoModule.forRoot({ pendoApiKey: 'pendo-api-key', pendoIdFormatter: spyOnFormatter })
      ],
      declarations: [RootComponent]
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

  it('should work when lazy loaded using forChild', fakeAsync(
    inject([Router, Location], (router: Router, location: Location) => {
      const LoadedModule = getLazyLoadedModule(NgxPendoModule.forChild());

      const fixture = createRoot(router, RootComponent);
      const service = TestBed.inject(NgxPendoService);

      const ids = ['a', 'b', 'c'];
      service.formatPendoId(...ids);
      expect(spyOnFormatter).toHaveBeenCalledTimes(ids.length);
      ids.forEach(id => expect(spyOnFormatter).toHaveBeenCalledWith(id));

      router.resetConfig([{ path: 'lazy', loadChildren: () => LoadedModule }]);
      router.navigateByUrl('/lazy/loaded/child');
      advance(fixture);

      expect(location.path()).toEqual('/lazy/loaded/child');

      spyOnFormatter.calls.reset();
      service.formatPendoId(...ids);
      expect(spyOnFormatter).toHaveBeenCalledTimes(ids.length);
    })
  ));
});
