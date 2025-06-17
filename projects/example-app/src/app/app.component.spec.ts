import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPendoModule } from 'ngx-pendo';
import { AppComponent } from './app.component';
import { kebabCase } from './utils';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'example-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('example-app');
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, example-app');
  });

  it('should render correct pendo id', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.nativeElement;
    await fixture.whenStable();
    expect(compiled.querySelector('main').getAttribute('data-pendo-id')).toBe('main');
    expect(compiled.querySelector('h1').getAttribute('data-pendo-id')).toBe('head.text');
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
