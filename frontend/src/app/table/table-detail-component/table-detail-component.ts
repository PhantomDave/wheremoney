import { Component, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TableService } from '../../services/table/table-service';
import { Table } from '../../models/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-table-detail-component',
  imports: [CommonModule, RouterLink],
  templateUrl: './table-detail-component.html',
  styleUrls: ['./table-detail-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDetailComponent implements OnInit {
  private readonly tableService = inject(TableService);
  private readonly route = inject(ActivatedRoute);

  readonly selectedTable = this.tableService.selectedTable;
  readonly loading = this.tableService.loading;
  readonly error = this.tableService.error;

  readonly hasTable = computed(() => this.selectedTable() !== null);
  readonly tableTitle = computed(() => this.selectedTable()?.name || 'No table selected');

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const tableId = parseInt(id, 10);
        this.tableService.getTableById(tableId);
      }
    });
  }

  onClearError() {
    this.tableService.clearError();
  }

  onSelectTable(table: Table | null) {
    this.tableService.selectTable(table);
  }
}
