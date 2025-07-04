import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPendoModule } from 'ngx-pendo';
import { AppComponent } from './app.component';
import { kebabCase } from './utils';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        NgxPendoModule.forRoot({
          pendoApiKey: 'pendo-api-key',
          pendoIdFormatter: kebabCase
        })
      ],
      declarations: [AppComponent],
      providers: [provideZonelessChangeDetection()]
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ngx-pendo-demo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ngx-pendo-demo');
  });

  it('should render title in a h1 tag', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ngx-pendo-demo!');
  });

  it('should render correct pendo id', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    await fixture.whenStable();
    expect(compiled.querySelector('h1').getAttribute('data-pendo-id')).toBe('head.text');
    expect(compiled.querySelector('h2').getAttribute('data-pendo-id')).toBe('tip');
    compiled
      .querySelectorAll('li[data-pendo-id]')
      .forEach((node: HTMLElement) =>
        expect(node.getAttribute('data-pendo-id')).toBe(`link.${node.getAttribute('ngx-pendo-id')}`)
      );
    compiled
      .querySelectorAll('p[data-pendo-id]')
      .forEach((node: HTMLElement) => expect(node.getAttribute('data-pendo-id')).toBe(node.textContent));
  });
});
