import { TestBed } from '@angular/core/testing';

import { MarkAllotService } from './mark-allot.service';

describe('MarkAllotService', () => {
  let service: MarkAllotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkAllotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
