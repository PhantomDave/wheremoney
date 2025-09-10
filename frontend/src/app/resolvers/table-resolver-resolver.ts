import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { TableService } from '../services/table/table-service';
import { Table } from '../models/table';

export const tableResolverResolver: ResolveFn<Table | null> = async (
  route: ActivatedRouteSnapshot,
) => {
  const idParam = route.paramMap.get('id');
  const id = idParam ? Number(idParam) : NaN;
  if (Number.isNaN(id)) return null;

  const tableService = inject(TableService);

  try {
    await tableService.getTableById(id);
    return tableService.selectedTable();
  } catch {
    return null;
  }
};
