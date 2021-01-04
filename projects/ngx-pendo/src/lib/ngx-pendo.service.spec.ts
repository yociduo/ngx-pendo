import { TestBed } from '@angular/core/testing';

import { NgxPendoService } from './ngx-pendo.service';

describe('NgxPendoService', () => {
  let service: NgxPendoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxPendoService]
    });
    service = TestBed.inject(NgxPendoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
