import { Component, Input } from '@angular/core';
import { Widget } from '../../../../models/widget';
import { Table } from '../../../../models/table';

@Component({
  selector: 'app-pie-chart-component',
  imports: [],
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.css',
})
export class PieChartComponent {
  @Input() widget: Widget | null = null;
  @Input() table: Table | null = null;
  @Input() data: unknown[] = [];
}
