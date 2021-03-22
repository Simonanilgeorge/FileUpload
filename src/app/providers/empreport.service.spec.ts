import { TestBed } from '@angular/core/testing';

import { EmpreportService } from './empreport.service';

describe('EmpreportService', () => {
  let service: EmpreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
