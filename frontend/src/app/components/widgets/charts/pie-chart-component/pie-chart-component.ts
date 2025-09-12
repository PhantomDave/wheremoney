import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Column } from '../../../../models/column';
import { Table } from '../../../../models/table';
import { Widget, WidgetData } from '../../../../models/widget';

interface PieChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

interface DirectChartData {
  labels: string[];
  data: number[];
}

@Component({
  selector: 'app-pie-chart-component',
  imports: [BaseChartDirective],
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.css',
})
export class PieChartComponent implements AfterViewInit, OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() widget!: Widget;
  @Input() table!: Table;
  @Input() data: { columns: Column[]; data: unknown[] } | DirectChartData = {
    columns: [],
    data: [],
  };
  @Input() isLoading = true;

  pieChartDataObj: PieChartData = { labels: [], datasets: [{ data: [] }] };

  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  ngAfterViewInit(): void {
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['widget'] || changes['isLoading']) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    console.log(
      'Updating chart data. isLoading:',
      this.isLoading,
      'widget:',
      this.widget,
      'data:',
      this.data,
    );

    if (this.isLoading) {
      console.log('Chart is still loading, skipping update');
      return;
    }

    // Check if we have direct chart data (for debugging)
    if (this.hasDirectChartData()) {
      this.processDirectChartData();
      return;
    }

    const widgetData = this.mapWidgetData();
    console.log('Mapped widget data:', widgetData);

    this.pieChartDataObj = { labels: [], datasets: [{ data: [] }] };

    this.mapAllChartData(widgetData);

    this.pieChartData = {
      labels: this.pieChartDataObj.labels,
      datasets: this.pieChartDataObj.datasets,
    };

    console.log('Final chart data:', this.pieChartData);

    if (this.chart) {
      this.chart.update();
    }
  }

  private hasDirectChartData(): boolean {
    // Check if data contains direct chart data (labels and data arrays)
    return (
      this.data &&
      typeof this.data === 'object' &&
      'labels' in this.data &&
      'data' in this.data &&
      Array.isArray(this.data.labels) &&
      Array.isArray(this.data.data)
    );
  }

  private processDirectChartData(): void {
    const directData = this.data as DirectChartData;
    console.log('Processing direct chart data:', directData);

    this.pieChartData = {
      labels: directData.labels,
      datasets: [
        {
          data: directData.data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
          ],
        },
      ],
    };

    console.log('Direct chart data processed:', this.pieChartData);

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
    const mergedByValue = new Map<string, number>();

    widgetDataArray.forEach((widgetData) => {
      const byValue = this.aggregateValuesByLabel(widgetData);
      byValue.forEach((val, label) => {
        const existing = mergedByValue.get(label) || 0;
        mergedByValue.set(label, existing + val);
      });
    });

    this.convertSummedValuesToChartData(mergedByValue);
  }

  private findNumericField(excludeKey: string): string | undefined {
    if (!this.data.data || this.data.data.length === 0) return undefined;

    const firstRow = this.data.data[0] as Record<string, unknown>;
    for (const key of Object.keys(firstRow)) {
      if (key === excludeKey) continue;
      // check some rows to see if this key yields numeric values
      for (const row of this.data.data) {
        if (!row || typeof row !== 'object') continue;
        const raw = (row as Record<string, unknown>)[key];
        const num = this.parseNumericValue(raw);
        if (!isNaN(num) && num !== 0) {
          return key;
        }
      }
    }
    return undefined;
  }

  /**
   * Aggregate rows by the grouping column (widgetData.category) and return a map where
   * key = actual data value (as string) and value = aggregated number (sum/count/average).
   */
  private aggregateValuesByLabel(widgetData: WidgetData): Map<string, number> {
    const result = new Map<string, { sum: number; count: number }>();
    const categoryKey = widgetData.category.replaceAll(' ', '_');

    const numericField = this.findNumericField(categoryKey);

    for (const row of this.data.data) {
      if (!row || typeof row !== 'object') continue;
      const rec = row as Record<string, unknown>;
      const rawLabel = rec[categoryKey];
      let label: string;
      if (rawLabel === undefined || rawLabel === null) {
        label = 'undefined';
      } else if (typeof rawLabel === 'object') {
        const json = (() => {
          try {
            return JSON.stringify(rawLabel);
          } catch {
            return undefined;
          }
        })();
        label = json ?? '[object]';
      } else if (typeof rawLabel === 'string') {
        label = rawLabel;
      } else if (typeof rawLabel === 'number' || typeof rawLabel === 'boolean') {
        label = rawLabel.toString();
      } else {
        label = JSON.stringify(rawLabel);
      }

      let numericValue = 0;
      if (numericField) {
        numericValue = this.parseNumericValue(rec[numericField]);
      } else if (
        widgetData.value === 'Sum' ||
        widgetData.value === 'Average' ||
        widgetData.value === 'Avg'
      ) {
        // fallback: try to parse the category column itself as numeric
        numericValue = this.parseNumericValue(rec[categoryKey]);
      }

      const entry = result.get(label) || { sum: 0, count: 0 };
      entry.sum += isNaN(numericValue) ? 0 : numericValue;
      entry.count += 1;
      result.set(label, entry);
    }

    // Convert to final numeric values depending on widgetData.value
    const out = new Map<string, number>();
    result.forEach((entry, label) => {
      let finalVal = 0;
      switch (widgetData.value) {
        case 'Count':
          finalVal = entry.count;
          break;
        case 'Average':
        case 'Avg':
          finalVal = entry.count > 0 ? entry.sum / entry.count : 0;
          break;
        case 'Sum':
        default:
          finalVal = entry.sum;
          break;
      }
      out.set(label, finalVal);
    });

    return out;
  }

  private parseNumericValue(value: unknown): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return 0;
  }

  private convertSummedValuesToChartData(summedValues: Map<string, number>): void {
    this.pieChartDataObj.labels = Array.from(summedValues.keys());
    this.pieChartDataObj.datasets[0].data = Array.from(summedValues.values());

    console.log('Compressed chart data:', {
      labels: this.pieChartDataObj.labels,
      data: this.pieChartDataObj.datasets[0].data,
    });
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
