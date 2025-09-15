import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Column } from '../../../../models/column';
import { Table } from '../../../../models/table';
import { Widget, WidgetData } from '../../../../models/widget';

interface InputData {
  columns: Column[];
  data: unknown[];
}

@Component({
  selector: 'app-pie-chart-component',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.css',
})
export class PieChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() widget!: Widget;
  @Input() table!: Table;
  @Input() data: InputData = {
    columns: [],
    data: [],
  };
  @Input() isLoading = true;
  @Input() pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  widgetData: WidgetData | null = null;

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  ngOnInit(): void {
    // Parse widget data safely
    try {
      this.widgetData = JSON.parse(this.widget.widget_data) as WidgetData;
    } catch (error) {
      console.error('Error parsing widget data:', error);
      this.widgetData = null;
    }

    this.mapDataFromInput();
  }

  mapDataFromInput(): void {
    const labels: string[] = [];
    const values: string[] = [];

    if (!this.widgetData || !this.data.data.length) {
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

    this.data.data.forEach((row) => {
      const rowObj = row as Record<string, unknown>;
      labels.forEach((labelCol) => {
        if (
          rowObj[labelCol] !== undefined &&
          !this.pieChartData.labels?.includes(String(rowObj[labelCol]))
        ) {
          this.pieChartData.labels?.push(String(rowObj[labelCol]));
          let summedValue = 0;
          this.data.data
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
