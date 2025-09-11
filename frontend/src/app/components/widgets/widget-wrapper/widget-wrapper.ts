import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Widget, WidgetType } from '../../../models/widget';
import { TableService } from '../../../services/table/table-service';
import { Flex } from '../../ui/flex/flex';
import { WidgetConfigurator } from '../configurator/widget-configurator/widget-configurator';
import { PieChartComponent } from '../charts/pie-chart-component/pie-chart-component';

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
export class WidgetWrapper {
  readonly dialog = inject(MatDialog);
  readonly tableService = inject(TableService);
  @Input() widget: Widget | null = null;

  get selectedTable() {
    return this.tableService.selectedTable();
  }

  openSettings() {
    this.dialog.open(WidgetConfigurator, {
      data: {
        widget: this.widget,
      },
    });
  }
}
