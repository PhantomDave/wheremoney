import { Component, inject } from '@angular/core';
import { TableService } from '../../../services/table/table-service';
import { Router, RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Flex } from '../../ui/flex/flex';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tables-list-component',
  imports: [MatProgressSpinner, Flex, MatButton, RouterLink, MatIconModule, MatListModule],
  templateUrl: './tables-list-component.html',
  styleUrl: './tables-list-component.css',
})
export class TablesListComponent {
  private tableService = inject(TableService);
  private router = inject(Router);

  get tables() {
    return this.tableService.tables();
  }

  get loading() {
    return this.tableService.loading();
  }

  get error() {
    return this.tableService.error();
  }

  async ngOnInit() {
    await this.tableService.getAllUserTables();
  }

  async onDeleteTable(id: number | undefined) {
    if (id) {
      await this.tableService.deleteTable(id);
    }
  }
}
