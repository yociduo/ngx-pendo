import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgxPendoIdDirective } from './ngx-pendo-id.directive';
import { NgxPendoService } from './ngx-pendo.service';

@Component({
  template: '<button ngx-pendo-id="click_test">Click Test</button>'
})
class TestComponent {
  constructor() {}
}

describe('NgxPendoIdDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, NgxPendoIdDirective],
      providers: [NgxPendoService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeDefined();
  });
});
