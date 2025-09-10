import { Component, inject, signal } from '@angular/core';
import { PieChartComponent } from '../../charts/pie-chart-component/pie-chart-component';
import { DataService } from '../../../services/data/data-service';
import { WidgetWrapper } from '../widget-wrapper/widget-wrapper';
import { Table } from '../../../models/table';

@Component({
  selector: 'app-pie-chart-widget',
  imports: [PieChartComponent, WidgetWrapper],
  templateUrl: './pie-chart-widget.html',
  styleUrl: './pie-chart-widget.css',
})
export class PieChartWidget {
  readonly dataService = inject(DataService);
  selectedTable = signal<Table | null>(null);

  data = {
    labels: ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'],
    datasets: [
      {
        data: [350, 450, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  onTableSelected(table: Table | null) {
    this.selectedTable.set(table);
    console.log('Selected table:', table);

    if (table?.id) {
      this.dataService.getDataByTableId(table.id);
    }
  }
}
