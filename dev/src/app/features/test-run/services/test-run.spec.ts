import { TestBed } from '@angular/core/testing';

import { TestRun } from './test-run';

describe('TestRun', () => {
  let service: TestRun;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestRun);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
