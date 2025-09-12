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
  @Input() data: { columns: Column[]; data: unknown[] } = { columns: [], data: [] };
  @Input() isLoading = true;

  pieChartDataObj: PieChartData = { labels: [], datasets: [{ data: [] }] };

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  ngAfterViewInit(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    const widgetData = this.mapWidgetData();
    
    // Reset chart data
    this.pieChartDataObj = { labels: [], datasets: [{ data: [] }] };
    
    // Process all widget data items
    this.mapAllChartData(widgetData);
    
    // Update the chart data object
    this.pieChartData = {
      labels: this.pieChartDataObj.labels,
      datasets: this.pieChartDataObj.datasets,
    };
    
    // Trigger chart update if chart exists
    if (this.chart) {
      this.chart.update();
    }
  }

  @Input() pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  private mapAllChartData(widgetDataArray: WidgetData[]): void {
    console.log('Mapping chart data for all widget data:', widgetDataArray);
    
    if (!this.data.data || this.data.data.length === 0) {
      console.log('No data available for chart mapping');
      return;
    }

    widgetDataArray.forEach((widgetData) => {
      this.mapChartData(widgetData);
    });
  }

  private mapChartData(type: WidgetData): void {
    console.log('Mapping chart data for type:', type);
    
    if (!this.data.data || this.data.data.length === 0) {
      return;
    }

    const categoryKey = type.category.replaceAll(' ', '_');
    
    switch (type.value) {
      case 'Sum': {
        console.log('Data for Sum calculation:', this.data);
        
        // Check if the category key exists in the data
        const firstRow = this.data.data[0];
        if (firstRow && typeof firstRow === 'object' && firstRow !== null) {
          const rowKeys = Object.keys(firstRow as Record<string, unknown>);
          
          if (rowKeys.includes(categoryKey)) {
            this.pieChartDataObj.labels.push(type.category);
            const sum = this.data.data.reduce((acc: number, row) => {
              if (row && typeof row === 'object' && row !== null) {
                const value = parseFloat(String((row as Record<string, unknown>)[categoryKey] || 0));
                return acc + (isNaN(value) ? 0 : value);
              }
              return acc;
            }, 0);
            this.pieChartDataObj.datasets[0].data.push(sum);
            console.log(`Sum for ${type.category}:`, sum);
          }
        }
        break;
      }
      case 'Average':
      case 'Avg': {
        console.log('Data for Average calculation:', this.data);
        
        const firstRow = this.data.data[0];
        if (firstRow && typeof firstRow === 'object' && firstRow !== null) {
          const rowKeys = Object.keys(firstRow as Record<string, unknown>);
          
          if (rowKeys.includes(categoryKey)) {
            this.pieChartDataObj.labels.push(type.category);
            
            const values = this.data.data
              .map((row): number => {
                if (row && typeof row === 'object' && row !== null) {
                  const value = parseFloat(String((row as Record<string, unknown>)[categoryKey] || 0));
                  return isNaN(value) ? 0 : value;
                }
                return 0;
              })
              .filter((val: number) => val !== 0); // Filter out zero values for average calculation
            
            const average = values.length > 0 ? values.reduce((acc: number, val: number) => acc + val, 0) / values.length : 0;
            this.pieChartDataObj.datasets[0].data.push(average);
            console.log(`Average for ${type.category}:`, average);
          }
        }
        break;
      }
      case 'Count': {
        this.pieChartDataObj.labels.push(type.category);
        const count = this.data.data.length;
        this.pieChartDataObj.datasets[0].data.push(count);
        console.log(`Count for ${type.category}:`, count);
        break;
      }
      default:
        console.log(`Unknown calculation type: ${type.value}`);
        break;
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
