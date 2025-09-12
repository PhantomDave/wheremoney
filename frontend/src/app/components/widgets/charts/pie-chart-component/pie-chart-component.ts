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
    console.log('Widget:', this.widget);
    console.log('Table:', this.table);
    console.log('Data:', this.data);
    console.log('Is Loading:', this.isLoading);
    console.log('Pie Chart Options:', this.pieChartOptions);

    // Parse widget data safely
    try {
      this.widgetData = JSON.parse(this.widget.widget_data) as WidgetData;
      console.log('Widget Data:', this.widgetData);
    } catch (error) {
      console.error('Error parsing widget data:', error);
      this.widgetData = null;
    }

    this.mapDataFromInput();
  }

  mapDataFromInput(): void {
    console.log('Mapping data from input...');
    console.log('Widget Data:', this.widgetData);
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
        values.push(String(value));
      }
    });

    this.mapDataForChart(labels, values);

    console.log('Chart data updated:', this.pieChartData);
  }

  mapDataForChart(labels: string[], values: string[]): void {
    console.log('Mapping data for chart...');
    console.log('Labels:', labels);
    console.log('Values:', values);

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
        }
      });

      values.forEach((valueCol) => {
        console.log('Processing value column:', valueCol, 'Value:', rowObj[valueCol]);
        if (rowObj[valueCol] !== undefined) {
          const value = Number(rowObj[valueCol]);
          if (!isNaN(value)) {
            this.pieChartData.datasets[0].data.push(value);
          }
        }
      });
    });

    console.log('Final chart data:', this.pieChartData);
  }
}
