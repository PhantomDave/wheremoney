import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TableService } from '../../../services/table/table-service';
import { Flex } from '../../ui/flex/flex';

@Component({
  selector: 'app-tables-list-component',
  imports: [MatProgressSpinner, Flex, MatButton, RouterLink, MatIconModule, MatListModule],
  templateUrl: './tables-list-component.html',
  styleUrl: './tables-list-component.css',
})
export class TablesListComponent implements OnInit {
  private readonly tableService = inject(TableService);

  get tables() {
    return this.tableService.tables();
  }

  get loading() {
    return this.tableService.loading();
  }

  get error() {
    return this.tableService.error();
  }

  ngOnInit() {
    this.tableService.getAllUserTables();
  }

  async onDeleteTable(id: number | undefined) {
    if (id) {
      await this.tableService.deleteTable(id);
    }
  }
}
