import { Component, computed, effect, input, viewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Table } from '../../../../models/table';
import { Widget } from '../../../../models/widget';
import { InputData } from '../../widget-wrapper/widget-wrapper';
import { ChartService } from '../../../../services/chart/chart.service';

@Component({
  selector: 'app-bar-chart-component',
  templateUrl: './bar-chart-component.component.html',
  styleUrls: ['./bar-chart-component.component.css'],
  imports: [BaseChartDirective],
})
export class BarChartComponentComponent {
  private readonly chartService = inject(ChartService);

  chart = viewChild<BaseChartDirective>(BaseChartDirective);

  widget = input.required<Widget>();
  table = input.required<Table>();
  data = input<InputData>({
    columns: [],
    data: [],
  });
  isLoading = input(true);
  barChartOptions = input<ChartConfiguration<'bar'>['options']>({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
    },
  });

  // Computed property that processes chart data using the service
  chartResult = computed(() =>
    this.chartService.processBarChartData(this.widget().widget_data, this.data()),
  );

  // Expose chart data and hasData as computed properties
  barChartData = computed(() => this.chartResult().chartData);
  hasData = computed(() => this.chartResult().hasData);

  constructor() {
    // Effect to update chart when data changes
    effect(() => {
      if (this.chart() && this.hasData()) {
        this.chart()?.update();
      }
    });
  }
}
