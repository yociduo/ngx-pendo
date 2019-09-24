import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { param } from 'change-case';
import { NgxPendoModule, NGX_PENDO_SETTINGS_TOKEN } from 'ngx-pendo';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxPendoModule.forChild(),
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: NGX_PENDO_SETTINGS_TOKEN,
          useValue: {
            pendoApiKey: 'pendo-api-key',
            pendoIdFormatter: param,
          }
        }
      ]
    }).compileComponents();
  }));

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

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ngx-pendo-demo!');
  });

  it('should render correct pendo id', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(compiled.querySelector('h1').getAttribute('data-pendo-id')).toBe('head.title.text');
    expect(compiled.querySelector('h2').getAttribute('data-pendo-id')).toBe('tip');
    compiled.querySelectorAll('li').forEach((node: HTMLElement) =>
      expect(node.getAttribute('data-pendo-id')).toBe(`link.${node.getAttribute('ngx-pendo-id')}`));
    compiled.querySelectorAll('p').forEach((node: HTMLElement) =>
      expect(node.getAttribute('data-pendo-id')).toBe(node.textContent));
  });
});
