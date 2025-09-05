import { TestBed } from '@angular/core/testing';

import { ApiWrapper } from './api-wrapper';

describe('ApiWrapper', () => {
  let service: ApiWrapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiWrapper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
