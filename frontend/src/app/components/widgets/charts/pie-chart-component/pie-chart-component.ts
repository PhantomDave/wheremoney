import { Component, computed, effect, input, viewChild, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Table } from '../../../../models/table';
import { Widget } from '../../../../models/widget';
import { InputData } from '../../widget-wrapper/widget-wrapper';
import { ChartService } from '../../../../services/chart/chart.service';

@Component({
  selector: 'app-pie-chart-component',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.css',
})
export class PieChartComponent {
  private readonly chartService = inject(ChartService);

  chart = viewChild<BaseChartDirective>(BaseChartDirective);

  widget = input<Widget>();
  table = input.required<Table>();
  data = input<InputData>({
    columns: [],
    data: [],
  });
  isLoading = input(true);

  pieChartOptions = input<ChartConfiguration['options']>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
      },
    },
  });

  // Computed property that processes chart data using the service
  widgetValue(): Widget | undefined {
    try {
      const maybeFn = this.widget as unknown as () => Widget | undefined;
      if (typeof maybeFn === 'function') return maybeFn();
    } catch {
      // fallthrough
    }
    return this.widget as unknown as Widget;
  }

  private readonly chartResult = computed(() =>
    this.chartService.processPieChartData(this.widgetValue()?.widget_data ?? '', this.data()),
  );

  // Expose chart data and hasData as computed properties
  pieChartData = computed(() => this.chartResult().chartData);
  hasData = computed(() => this.chartResult().hasData);

  // Computed property for label count (if needed for specific pie chart logic)
  labelCount = computed(() => this.pieChartData().labels?.length || 0);

  constructor() {
    // Effect to update chart when data changes
    effect(() => {
      if (this.chart() && this.hasData()) {
        this.chart()?.update();
      }
    });
  }
}
