// src/app/components/data/data-details-component/data-details-component.ts
import { AfterViewInit, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data/data-service';
import { Table } from '../../../models/table';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Column } from '../../../models/column';
import { TableService } from '../../../services/table/table-service';
import { MatSortModule, MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-data-details-component',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './data-details-component.html',
  styleUrl: './data-details-component.css',
})
export class DataDetailsComponent implements OnInit, AfterViewInit {
  private dataService = inject(DataService);
  private tableService = inject(TableService);
  private route = inject(ActivatedRoute);

  @Input() table: Table | null = null;
  @ViewChild(MatSort) sort!: MatSort;

  // Use a MatTableDataSource so assigning `sort` is type-correct
  private _matDataSource = new MatTableDataSource<unknown>([]);
  get dataSource(): MatTableDataSource<unknown> {
    return this._matDataSource;
  }

  displayedColumns: string[] = [];

  ngAfterViewInit() {
    // Ensure sort header ids map to the actual object keys (replace spaces with underscores)
    this.dataSource.sortingDataAccessor = (row: unknown, sortHeaderId: string): string | number => {
      if (row && typeof row === 'object') {
        const key = sortHeaderId.replaceAll(' ', '_');
        const value = (row as Record<string, unknown>)[key];

        if (value == null) return '';
        if (typeof value === 'number') return value;
        if (value instanceof Date) return value.getTime();
        return String(value).toLowerCase();
      }
      return '';
    };

    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      if (this.table?.id !== undefined) {
        await this.dataService.getDataByTableId(this.table.id);
      }
      let selected = this.table;
      if (!selected) {
        const id = params.get('id');
        const tableId = parseInt(id!, 10);
        if (id) {
          await this.tableService.getTableById(tableId);
          selected = this.tableService.selectedTable();
        }
      }
      // update displayed columns
      if (selected && Array.isArray(selected.columns)) {
        this.displayedColumns = selected.columns
          .map((col: Column) => (col.name != null ? String(col.name) : ''))
          .filter((id) => id !== '');
      } else {
        this.displayedColumns = [];
      }

      // compute and assign data to the MatTableDataSource
      this._matDataSource.data = this.computeDataArray();
    });
  }

  get data(): unknown {
    return this.dataService.data();
  }

  private computeDataArray(): unknown[] {
    const raw = this.dataService.data();
    if (Array.isArray(raw)) {
      return raw;
    }
    if (raw && typeof raw === 'object' && Array.isArray((raw as Record<string, unknown>)['data'])) {
      return (raw as Record<string, unknown>)['data'] as unknown[];
    }
    return [];
  }

  getCellValue(row: unknown, key: string): unknown {
    if (row && typeof row === 'object') {
      key = key.replaceAll(' ', '_');
      return (row as Record<string, unknown>)[key];
    }
    return undefined;
  }
}
