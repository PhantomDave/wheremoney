import { Component, input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Table } from '../../../../models/table';
import { Widget, WidgetData } from '../../../../models/widget';
import { InputData } from '../../widget-wrapper/widget-wrapper';

@Component({
  selector: 'app-pie-chart-component',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.css',
})
export class PieChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  widget = input.required<Widget>();
  table = input.required<Table>();
  data = input<InputData>({
    columns: [],
    data: [],
  });
  isLoading = input(true);

  labelCount = 0;

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

  widgetData: WidgetData | null = null;

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  ngOnInit(): void {
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
        this.labelCount += 1;
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
          !this.pieChartData.labels?.includes(String(rowObj[labelCol]))
        ) {
          this.pieChartData.labels?.push(String(rowObj[labelCol]));
          let summedValue = 0;
          this.data().data
            // @ts-expect-error - Temporarily ignoring index signature error
            .filter((r) => r[labelCol] === rowObj[labelCol])
            .forEach((otherRow) => {
              // @ts-expect-error - Temporarily ignoring index signature error
              const value = Number(otherRow[values[0]] as unknown);
              summedValue += value;
            });

          // Add the summed value to the dataset
          this.pieChartData.datasets[0].data.push(summedValue);
        }
      });
    });
  }
}
