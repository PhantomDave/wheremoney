import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { anonymousGuardGuard } from './anonymous-guard-guard';

describe('anonymousGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => anonymousGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
