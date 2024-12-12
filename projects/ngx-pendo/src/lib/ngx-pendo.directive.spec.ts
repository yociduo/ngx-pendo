import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgxPendoIdDirective } from './ngx-pendo-id.directive';
import { NgxPendoSectionDirective } from './ngx-pendo-section.directive';
import { provideNgxPendo } from './ngx-pendo.provide';

@Component({
  imports: [NgFor, NgxPendoSectionDirective, NgxPendoIdDirective],
  template: `
    <div ngx-pendo-section="variable">
      <p [ngx-pendo-id]="id">variable.variable-id</p>
      <div [ngx-pendo-section]="section">
        <p [ngx-pendo-id]="id">variable.variable-section.variable-id</p>
      </div>
      <button (click)="addId()">id</button>&nbsp;
      <button (click)="addSection()">section</button>
    </div>

    <hr />

    <div ngx-pendo-section="dynamic">
      <div ngx-pendo-section="test">
        <p ngx-pendo-id="1">dynamic.test.1</p>
      </div>
      <div ngx-pendo-section="nest">
        <p ngx-pendo-id="1">dynamic.nest.1</p>
        <div ngx-pendo-section="nest-inner">
          <p ngx-pendo-id="1">dynamic.nest.nest-inner.1</p>
        </div>
      </div>
      <div ngx-pendo-section="list">
        <div *ngFor="let item of list; let i = index" [ngx-pendo-section]="i.toString()">
          <p [ngx-pendo-id]="i.toString()">dynamic.list.{{ i }}.{{ i }}</p>
        </div>
        <button (click)="addItem()">add</button>&nbsp;
        <button (click)="removeItem()">remove</button>
      </div>
    </div>

    <hr />

    <div ngx-pendo-section="pendo format">
      <p ngx-pendo-id="pendo id">pendo-format.pendo-id</p>
      <p ngx-pendo-id="pendo_id">pendo-format.pendo-id</p>
      <p ngx-pendo-id="PENDO_ID">pendo-format.pendo-id</p>
    </div>

    <hr />

    <div ngx-pendo-section="inherit">
      <p ngx-pendo-id="enable" [ngx-pendo-inherit]="true">inherit.enable</p>
      <p ngx-pendo-id="disable" [ngx-pendo-inherit]="false">disable</p>
      <div ngx-pendo-section="section" [ngx-pendo-inherit]="true">
        <p ngx-pendo-id="enable" [ngx-pendo-inherit]="true">inherit.section.enable</p>
        <p ngx-pendo-id="disable" [ngx-pendo-inherit]="false">disable</p>
      </div>
      <div ngx-pendo-section="section-disabled" [ngx-pendo-inherit]="false">
        <p ngx-pendo-id="enable" [ngx-pendo-inherit]="true">section-disabled.enable</p>
        <p ngx-pendo-id="disable" [ngx-pendo-inherit]="false">disable</p>
      </div>
    </div>
  `
})
class TestComponent {
  list = new Array(10).fill(null);
  id = 'variable-id';
  section = 'variable-section';

  addItem(): void {
    this.list.push(null);
  }

  removeItem(): void {
    this.list.pop();
  }

  addId(): void {
    this.id += '-id';
  }

  addSection(): void {
    this.section += '-section';
  }
}

describe('NgxPendoDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNgxPendo({
          pendoApiKey: 'pendo-api-key',
          pendoIdFormatter: str =>
            str
              .replace(/([a-z])([A-Z])/g, '$1-$2')
              .replace(/[\s_]+/g, '-')
              .toLowerCase()
        })
      ]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeDefined();
  });

  it('should render correct pendo id', async () => {
    const compiled = fixture.nativeElement;
    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();

    compiled
      .querySelectorAll('li[data-pendo-id]')
      .forEach((node: HTMLElement) =>
        expect(node.getAttribute('data-pendo-id')).toBe(`link.${node.getAttribute('ngx-pendo-id')}`)
      );
    compiled
      .querySelectorAll('p[data-pendo-id]')
      .forEach((node: HTMLElement) => expect(node.getAttribute('data-pendo-id')).toBe(node.textContent));
  });

  it('should get correct pendo id after changes', async () => {
    const compiled = fixture.nativeElement;
    fixture.detectChanges();

    component.addSection();
    component.addId();
    fixture.detectChanges();

    compiled
      .querySelectorAll('div[ngx-pendo-section*="variable"] p[data-pendo-id]')
      .forEach((node: HTMLElement) =>
        expect(node.getAttribute('data-pendo-id')).toBe(
          node
            .textContent!.replace('variable-section', 'variable-section-section')
            .replace('variable-id', 'variable-id-id')
        )
      );
  });

  it('should get correct pendo id after add or remove list', async () => {
    const compiled = fixture.nativeElement;
    fixture.detectChanges();

    const doCheck = async (len: number) => {
      // TODO: find way to implement without timeout
      await new Promise(resolve => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(compiled.querySelectorAll('div[ngx-pendo-section*="list"] p[data-pendo-id]').length).toBe(len);
      compiled
        .querySelectorAll('div[ngx-pendo-section*="list"] p[data-pendo-id]')
        .forEach((node: HTMLElement) => expect(node.getAttribute('data-pendo-id')).toBe(node.textContent));
    };

    await doCheck(10);

    component.addItem();
    fixture.detectChanges();

    await doCheck(11);

    component.removeItem();
    fixture.detectChanges();

    await doCheck(10);
  });
});
