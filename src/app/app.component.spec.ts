import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxPendoModule } from 'ngx-pendo';
import { AppComponent } from './app.component';
import { kebabCase } from './utils';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        NgxPendoModule.forRoot({
          pendoApiKey: 'pendo-api-key',
          pendoIdFormatter: kebabCase
        })
      ],
      declarations: [AppComponent]
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

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ngx-pendo-demo!');
  });

  it('should render correct pendo id', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 100));
    fixture.detectChanges();
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
