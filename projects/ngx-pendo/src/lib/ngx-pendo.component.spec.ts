import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxPendoComponent } from './ngx-pendo.component';

describe('NgxPendoComponent', () => {
  let component: NgxPendoComponent;
  let fixture: ComponentFixture<NgxPendoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxPendoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxPendoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
