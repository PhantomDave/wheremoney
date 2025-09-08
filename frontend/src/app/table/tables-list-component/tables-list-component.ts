import { Component, inject } from '@angular/core';
import { TableService } from '../../services/table/table-service';
import { Router } from '@angular/router';
import { MatListItem, MatListSubheaderCssMatStyler, MatNavList } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tables-list-component',
  imports: [
    MatNavList,
    MatListItem,
    MatNavList,
    MatListItem,
    MatProgressSpinner,
    MatListSubheaderCssMatStyler,
  ],
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
    if (!this.tables) {
      await this.tableService.getAllUserTables();
    }
  }

  openTable(id: string | number) {
    void this.router.navigate(['/table', id]);
  }
}
