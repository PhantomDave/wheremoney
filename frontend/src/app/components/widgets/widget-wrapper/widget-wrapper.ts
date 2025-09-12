import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Widget, WidgetType } from '../../../models/widget';
import { DataService } from '../../../services/data/data-service';
import { TableService } from '../../../services/table/table-service';
import { Flex } from '../../ui/flex/flex';
import { PieChartComponent } from '../charts/pie-chart-component/pie-chart-component';
import { WidgetConfigurator } from '../configurator/widget-configurator/widget-configurator';

@Component({
  selector: 'app-widget-wrapper',
  imports: [
    Flex,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    PieChartComponent,
  ],
  templateUrl: './widget-wrapper.html',
  styleUrl: './widget-wrapper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetWrapper implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly tableService = inject(TableService);
  readonly dataService = inject(DataService);
  readonly WidgetType = WidgetType;
  @Input() widget!: Widget;

  ngOnInit(): void {
    if (this.widget?.table_id) {
      this.loadWidgetData(this.widget.table_id);
    }
  }

  private async loadWidgetData(tableId: number): Promise<void> {
    try {
      await Promise.all([
        this.dataService.getDataByTableId(tableId),
        this.tableService.getTableById(tableId),
      ]);
    } catch (error) {
      console.error('Error loading widget data:', error);
    }
  }

  get selectedTable() {
    return this.tableService.selectedTable();
  }

  get data() {
    return this.dataService.data();
  }

  get isLoading() {
    return this.dataService.loading() || this.tableService.loading();
  }

  openSettings() {
    if (this.widget) {
      this.dialog.open(WidgetConfigurator, {
        data: {
          widget: this.widget,
        },
      });
    }
  }
}
