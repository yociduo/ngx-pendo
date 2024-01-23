import { TestBed } from '@angular/core/testing';
import { provideNgxPendo } from 'ngx-pendo';
import { AppComponent } from './app.component';
import { kebabCase } from './utils';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideNgxPendo({
          pendoApiKey: 'pendo-api-key',
          pendoIdFormatter: kebabCase
        })
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'standalone-app' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('standalone-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, standalone-app');
  });

  it('should render correct pendo id', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.nativeElement;
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100));
    fixture.detectChanges();
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
