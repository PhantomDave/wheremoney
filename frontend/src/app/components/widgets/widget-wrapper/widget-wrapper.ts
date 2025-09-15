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
import { PieChartComponent } from '../charts/pie-chart-component/pie-chart-component';
import { WidgetConfigurator } from '../configurator/widget-configurator/widget-configurator';
import { Column } from '../../../models/column';
import { BarChartComponentComponent } from '../charts/bar-chart-component/bar-chart-component.component';
import { BaseWidget } from 'gridstack/dist/angular';
import { MatCard, MatCardModule } from '@angular/material/card';

export interface InputData {
  columns: Column[];
  data: unknown[];
}

@Component({
  selector: 'app-widget-wrapper',
  imports: [
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    PieChartComponent,
    BarChartComponentComponent,
    MatCard,
    MatCardModule,
  ],
  templateUrl: './widget-wrapper.html',
  styleUrl: './widget-wrapper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetWrapper extends BaseWidget implements OnInit {
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
