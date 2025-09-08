import { TestBed } from '@angular/core/testing';

import { TestFeature } from './test-feature';

describe('TestFeature', () => {
  let service: TestFeature;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestFeature);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
