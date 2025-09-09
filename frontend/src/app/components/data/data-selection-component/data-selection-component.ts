import { Component, inject, OnInit } from '@angular/core';
import { TableService } from '../../../services/table/table-service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Table } from '../../../models/table';
import { DataDetailsComponent } from '../data-details-component/data-details-component';

@Component({
  selector: 'app-data-selection-component',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule, DataDetailsComponent],
  templateUrl: './data-selection-component.html',
  styleUrl: './data-selection-component.css',
})
export class DataSelectionComponent implements OnInit {
  readonly tableService = inject(TableService);
  selectedTable: Table | null = null;
  ngOnInit() {
    this.tableService.getAllUserTables().then();
  }

  get tables(): Table[] {
    return this.tableService.tables();
  }

  onSelectionChange(value: number) {
    this.selectedTable = this.tables.find((t) => t.id === value) || null;
  }
}
