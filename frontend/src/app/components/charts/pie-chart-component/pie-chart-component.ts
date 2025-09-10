import {
  Component,
  ViewChild,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-pie-chart-component',
  imports: [MatDivider, BaseChartDirective],
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() title = 'Pie Chart';
  @Input() pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  @Input() pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  };

  @Output() chartClick = new EventEmitter<{ event: ChartEvent; active: object[] }>();
  @Output() chartHover = new EventEmitter<{ event: ChartEvent; active: object[] }>();

  public pieChartType: ChartType = 'pie';

  addSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.push(['Line 1', 'Line 2', 'Line 3']);
    }

    this.pieChartData.datasets[0].data.push(400);

    this.chart?.update();
  }

  removeSlice(): void {
    if (this.pieChartData.labels) {
      this.pieChartData.labels.pop();
    }

    this.pieChartData.datasets[0].data.pop();

    this.chart?.update();
  }
}
