import { Component, input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Table } from '../../../../models/table';
import { Widget, WidgetData } from '../../../../models/widget';
import { InputData } from '../../widget-wrapper/widget-wrapper';

@Component({
  selector: 'app-bar-chart-component',
  templateUrl: './bar-chart-component.component.html',
  styleUrls: ['./bar-chart-component.component.css'],
  imports: [BaseChartDirective],
})
export class BarChartComponentComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

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

  widgetData: WidgetData | null = null;

  barChartData: ChartData<'bar', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  ngOnInit(): void {
    // Parse widget data safely
    try {
      this.widgetData = JSON.parse(this.widget().widget_data) as WidgetData;
    } catch (error) {
      console.error('Error parsing widget data:', error);
      this.widgetData = null;
    }

    this.mapDataFromInput();
  }

  mapDataFromInput(): void {
    const labels: string[] = [];
    const values: string[] = [];

    if (!this.widgetData || !this.data().data.length) {
      console.log('No widget data or input data available');
      return;
    }

    Object.keys(this.widgetData).forEach((key) => {
      // @ts-expect-error - Temporarily ignoring index signature error
      const value = this.widgetData![key] as string;
      if (value && value === 'Label') {
        labels.push(key);
      }
      if (value && value === 'Values') {
        values.push(key);
      }
    });

    this.mapDataForChart(labels, values);
  }

  mapDataForChart(labels: string[], values: string[]): void {
    if (!labels.length || !values.length) {
      console.log('No labels or values specified in widget data');
      return;
    }

    this.data().data.forEach((row) => {
      const rowObj = row as Record<string, unknown>;
      labels.forEach((labelCol) => {
        if (
          rowObj[labelCol] !== undefined &&
          !this.barChartData.labels?.includes(String(rowObj[labelCol]))
        ) {
          this.barChartData.labels?.push(String(rowObj[labelCol]));
          let summedValue = 0;
          this.data().data
            // @ts-expect-error - Temporarily ignoring index signature error
            .filter((r) => r[labelCol] === rowObj[labelCol])
            .forEach((otherRow) => {
              // @ts-expect-error - Temporarily ignoring index signature error
              const value = Number(otherRow[values[0]] as unknown);
              summedValue += value;
            });

          this.barChartData.datasets[0].data.push(summedValue);
        }
      });
    });
  }
}
