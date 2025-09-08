import { Component, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TableService } from '../../services/table/table-service';
import { Table } from '../../models/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-table-detail-component',
  imports: [CommonModule, RouterLink, MatButton, MatListModule],
  templateUrl: './table-detail-component.html',
  styleUrls: ['./table-detail-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDetailComponent implements OnInit {
  private readonly tableService = inject(TableService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = this.tableService.loading;
  readonly error = this.tableService.error;

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const tableId = parseInt(id, 10);
        this.tableService.getTableById(tableId);
      }
    });
  }

  get table(): Table | null {
    console.log('Selected table:', this.tableService.selectedTable());
    return this.tableService.selectedTable();
  }

  onClearError() {
    this.tableService.clearError();
  }

  onSelectTable(table: Table | null) {
    this.tableService.selectTable(table);
  }
}
