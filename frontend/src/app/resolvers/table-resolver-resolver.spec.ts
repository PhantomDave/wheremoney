import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { tableResolverResolver } from './table-resolver-resolver';

describe('tableResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => tableResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
