import { TestBed } from '@angular/core/testing';

import { NgxPendoService } from './ngx-pendo.service';

describe('NgxPendoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxPendoService = TestBed.get(NgxPendoService);
    expect(service).toBeTruthy();
  });
});
