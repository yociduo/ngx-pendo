import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPageAComponent } from './test-page-a.component';

describe('TestPageAComponent', () => {
  let component: TestPageAComponent;
  let fixture: ComponentFixture<TestPageAComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TestPageAComponent],
      providers: [provideZonelessChangeDetection()]
    });
    fixture = TestBed.createComponent(TestPageAComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
