import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Column } from '../../../../models/column';
import { Table } from '../../../../models/table';
import { Widget, WidgetType } from '../../../../models/widget';
import { TableService } from '../../../../services/table/table-service';
import { Flex } from '../../../ui/flex/flex';
import { WidgetService } from './../../../../services/widget/widget-service';

export interface ConfiguratorData {
  widget: Widget;
}

@Component({
  selector: 'app-widget-configurator',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule,
    Flex,
  ],
  templateUrl: './widget-configurator.html',
  styleUrls: ['./widget-configurator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetConfigurator implements OnInit {
  readonly dialogRef = inject(MatDialogRef<WidgetConfigurator>);
  readonly data = inject<ConfiguratorData>(MAT_DIALOG_DATA);
  readonly widget = model(this.data.widget);
  readonly widgetTypes = [
    WidgetType.BAR_CHART,
    WidgetType.LINE_CHART,
    WidgetType.PIE_CHART,
    WidgetType.TABLE,
    WidgetType.NUMBER_CARD,
  ];
  readonly tableService = inject(TableService);
  readonly widgetService = inject(WidgetService);

  selectedTable = input<Table | null>(null);

  readonly selectedTableChanged = output<Table | null>();

  onCheckboxClicked($event: MatCheckboxChange, column: Column) {
    this.selection.toggle(column);
    if (!$event.checked) {
      delete this.mappedSelection[column.name];
    } else if (!(column.name in this.mappedSelection)) {
      this.mappedSelection[column.name] = this.types[0];
    }
  }

  ngOnInit() {
    this.tableService.getAllUserTables().then();
  }

  get tables(): Table[] {
    return this.tableService.tables();
  }

  onSelectionChange(value: number) {
    const table = this.tables.find((t) => t.id === value) || null;
    this.selectedTableChanged.emit(table);
  }

  onWidgetTypeSelection(type: WidgetType) {
    this.widget().type = type;
  }

  onTypeAggregationChange(value: string, column: Column) {
    if (this.selection.isSelected(column)) {
      this.mappedSelection[column.name] = value;
    }
  }

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Column>(this.allowMultiSelect, this.initialSelection);
  types = ['Label', 'Values'];
  mappedSelection: Record<string, string> = {};

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.selectedTable()?.columns?.length || 0;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    const columns = this.selectedTable()?.columns ?? [];
    this.selection.select(...columns);
    columns.forEach((column) => {
      this.mappedSelection[column.name] = this.types[0];
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    const widget: Widget = {
      ...this.widget(),
      widget_data: JSON.stringify(this.mappedSelection),
      table_id: this.selectedTable()?.id,
    };
    this.widgetService.updateWidget(widget);
    this.dialogRef.close(widget);
  }

  onTypeSelectionChange(value: string, column: Column) {
    this.mappedSelection[column.name] = value;
  }
}
