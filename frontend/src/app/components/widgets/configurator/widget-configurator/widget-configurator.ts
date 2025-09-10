import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WidgetWrapper } from '../../widget-wrapper/widget-wrapper';
import { Table } from '../../../../models/table';
import { Column } from '../../../../models/column';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';

export interface ConfiguratorData {
  table: Table;
  widgetId: number;
  widgetType: string;
  selectedColumns?: Column[];
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
    MatDialogClose,
    MatCheckboxModule,
    MatTableModule,
    MatSelectModule,
  ],
  templateUrl: './widget-configurator.html',
  styleUrls: ['./widget-configurator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetConfigurator {
  readonly dialogRef = inject(MatDialogRef<WidgetWrapper>);
  readonly data = inject<ConfiguratorData>(MAT_DIALOG_DATA);
  readonly table = model(this.data.table);
  readonly widgetId = model(this.data.widgetId);
  readonly widgetType = model(this.data.widgetType);

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Column>(this.allowMultiSelect, this.initialSelection);
  types = ['Sum', 'Average', 'Count', 'Max', 'Min'];
  mappedSelection = new Map<string, string>();

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.table.columns?.length || 0;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    // Select all columns
    this.selection.select(...this.data.table.columns);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): ConfiguratorData {
    return {
      table: this.data.table,
      widgetId: this.data.widgetId,
      widgetType: this.data.widgetType,
      selectedColumns: this.selection.selected,
    };
  }

  onTypeSelectionChange(value: string, column: Column) {
    this.mappedSelection.set(column.name, value);
    console.table(this.mappedSelection);
  }
}
