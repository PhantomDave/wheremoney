import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { Table } from '../models/table';

import { tableResolverResolver } from './table-resolver-resolver';

describe('tableResolverResolver', () => {
  const executeResolver: ResolveFn<Table | null> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => tableResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
