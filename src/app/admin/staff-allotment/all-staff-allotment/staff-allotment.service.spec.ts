import { TestBed } from '@angular/core/testing';

import { StaffAllotmentService } from './staff-allotment.service';

describe('StaffAllotmentService', () => {
  let service: StaffAllotmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffAllotmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
