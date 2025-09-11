import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Column } from '../../../../models/column';
import { Table } from '../../../../models/table';
import { Widget, WidgetData } from '../../../../models/widget';

interface PieChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

@Component({
  selector: 'app-pie-chart-component',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.css',
})
export class PieChartComponent implements AfterViewInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() widget!: Widget;
  @Input() table!: Table;
  @Input() data: { columns: Column[]; data: any[] } = { columns: [], data: [] };
  @Input() isLoading = true;

  pieChartDataObj: PieChartData = { labels: [], datasets: [{ data: [] }] };

  labels: string[] = this.mapWidgetData().map((d) => d.category);
  ngAfterViewInit(): void {
    const widgetData = this.mapWidgetData();

    console.log(this.mapChartData(widgetData[0]));
  }

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.pieChartDataObj.labels,
    datasets: this.pieChartDataObj.datasets,
  };

  @Input() pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  mapChartData(type: WidgetData): number[] {
    console.log('Mapping chart data for type:', type);
    switch (type.value) {
      case 'Sum': {
        console.log('Data for Sum calculation:', this.data);
        Object.keys(this.data.data[0]).forEach((key) => {
          if (key === type.category.replaceAll(' ', '_')) {
            this.pieChartDataObj.labels.push(key);
            const sum = this.data.data.reduce((acc, row) => {
              const value = parseFloat(row[key]);
              return acc + (isNaN(value) ? 0 : value);
            }, 0);
            this.pieChartDataObj.datasets[0].data.push(sum);
            console.log(`Sum for ${key}:`, sum);
          }
        });

        return [];
      }
      case 'Count':
        return this.data.data.map((row) => 1);
      default:
        return [];
    }
  }

  mapWidgetData(): WidgetData[] {
    if (!this.widget) {
      return [];
    }
    try {
      const parsedData = JSON.parse(this.widget.widget_data);
      const mappedData = Object.entries(parsedData).map(([key, value]) => {
        return {
          category: key,
          value: value,
        };
      });
      return mappedData as WidgetData[];
    } catch (error) {
      console.error('Error parsing widget data:', error);
      return [];
    }
  }
}
