import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  output,
  signal,
  model,
} from '@angular/core';
import { Flex } from '../../ui/flex/flex';
import { TableService } from '../../../services/table/table-service';
import { Table } from '../../../models/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { WidgetConfigurator } from '../configurator/widget-configurator/widget-configurator';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-widget-wrapper',
  imports: [
    Flex,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './widget-wrapper.html',
  styleUrl: './widget-wrapper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetWrapper implements OnInit {
  readonly tableService = inject(TableService);
  selectedTableChanged = output<Table | null>();
  selectedTable = signal<Table | null>(null);
  ngOnInit() {
    this.tableService.getAllUserTables().then();
  }

  get tables(): Table[] {
    return this.tableService.tables();
  }

  onSelectionChange(value: number) {
    const table = this.tables.find((t) => t.id === value) || null;
    this.selectedTable.set(table);
    this.selectedTableChanged.emit(table);
  }

  //Dialog Stuff
  readonly animal = signal('');
  readonly name = model('');
  readonly dialog = inject(MatDialog);

  openSettings() {
    this.dialog.open(WidgetConfigurator, {
      data: {
        table: this.selectedTable()!,
        widgetId: Math.floor(Math.random() * 1000),
        widgetType: 'Sample Widget',
      },
    });
  }
}
