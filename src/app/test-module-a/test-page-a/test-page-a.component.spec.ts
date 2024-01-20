import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPageAComponent } from './test-page-a.component';

describe('TestPageAComponent', () => {
  let component: TestPageAComponent;
  let fixture: ComponentFixture<TestPageAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestPageAComponent]
    });
    fixture = TestBed.createComponent(TestPageAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
