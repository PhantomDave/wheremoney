import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../services/data/data-service';
import { TableService } from '../../../services/table/table-service';
import { Table } from '../../../models/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Column } from '../../../models/column';

@Component({
  selector: 'app-data-details-component',
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './data-details-component.html',
  styleUrl: './data-details-component.css',
})
export class DataDetailsComponent implements OnInit {
  private dataService = inject(DataService);
  private tableService = inject(TableService);
  private route = inject(ActivatedRoute);

  // Compute the table data source on demand. The DataService stores either
  // an array directly or an object with a `data` property (used by mocks).
  // We type the raw service value as `unknown` and perform runtime checks
  // to safely access the fields we need.
  get dataSource(): any[] {
    const raw = this.dataService.data();
    if (Array.isArray(raw)) {
      return raw;
    }
    if (raw && typeof raw === 'object' && Array.isArray((raw as any).data)) {
      return (raw as any).data;
    }
    return [];
  }
  // start empty so the table doesn't try to render a blank column while data loads
  displayedColumns: string[] = [];

  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const id = params.get('id');
      if (id) {
        const tableId = parseInt(id, 10);
        await this.tableService.getTableById(tableId);
        await this.dataService.getDataByTableId(tableId);
      }

      console.table(this.dataSource);
      const selected = this.tableService.selectedTable();
      if (selected && Array.isArray(selected.columns)) {
        this.displayedColumns = selected.columns
          .map((col: Column) => (col.id != null ? String(col.id) : ''))
          .filter((id) => id !== '');
      } else {
        this.displayedColumns = [];
      }
      console.log(this.displayedColumns);
    });
  }

  get table(): Table {
    return this.tableService.selectedTable()!;
  }

  // If you need table columns later you can read them from `table.columns`.

  // Keep the raw service value accessible. We avoid `any` on this getter to
  // encourage runtime checks where the shape is uncertain.
  get data(): unknown {
    return this.dataService.data();
  }

  // Safe helper to read a field from a data row whose shape is unknown.
  // Use this in the template like: {{ getCellValue(row, 'fieldName') }}
  getCellValue(row: unknown, key: string): unknown {
    if (row && typeof row === 'object') {
      key = key.replaceAll(' ', '_');
      return (row as Record<string, unknown>)[key];
    }
    return undefined;
  }
}
