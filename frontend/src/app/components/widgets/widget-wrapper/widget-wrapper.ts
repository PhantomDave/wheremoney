import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
    MatProgressSpinner,
  ],
  templateUrl: './widget-wrapper.html',
  styleUrl: './widget-wrapper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetWrapper extends BaseWidget {
  readonly dialog = inject(MatDialog);
  readonly tableService = inject(TableService);
  readonly dataService = inject(DataService);
  readonly WidgetType = WidgetType;
  widget = input.required<Widget>();
  private lastLoadedTableId: number | null = null;

  constructor() {
    super();
    // Use an effect in the constructor (injection context) to react to widget input
    effect(() => {
      const tableId = this.widgetValue()?.table_id;
      if (tableId && tableId !== this.lastLoadedTableId) {
        this.lastLoadedTableId = tableId;
        void this.loadWidgetData(tableId);
      }
    });
  }
  // Helper to accept either a signal (callable) or a plain object passed by Gridstack.
  widgetValue(): Widget | undefined {
    // If widget is a signal (function), call it; otherwise return it directly
    // (Gridstack may pass a plain object).
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const maybeFn = this.widget as unknown as any;
      if (typeof maybeFn === 'function') return maybeFn();
    } catch {
      // fallthrough to return the raw value
    }
    return this.widget as unknown as Widget;
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
    const w = this.widgetValue();
    if (w) {
      this.dialog.open(WidgetConfigurator, {
        data: {
          widget: w,
        },
      });
    }
  }
}
