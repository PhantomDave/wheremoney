import { Injectable } from '@angular/core';
import { ChartData } from 'chart.js';
import { InputData } from '../../components/widgets/widget-wrapper/widget-wrapper';

export interface ChartMappingResult {
  labels: string[];
  values: string[];
}

export interface BarChartDataResult {
  chartData: ChartData<'bar', number[], string>;
  hasData: boolean;
}

export interface PieChartDataResult {
  chartData: ChartData<'pie', number[], string>;
  hasData: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  /**
   * Safely parses widget data JSON string
   */
  parseWidgetData(widgetDataString: string): Record<string, string> | null {
    try {
      return JSON.parse(widgetDataString) as Record<string, string>;
    } catch (error) {
      console.error('Error parsing widget data:', error);
      return null;
    }
  }

  /**
   * Extracts label and value column names from widget data
   */
  extractColumnMappings(widgetData: Record<string, string> | null): ChartMappingResult {
    const labels: string[] = [];
    const values: string[] = [];

    if (!widgetData) {
      return { labels, values };
    }

    Object.keys(widgetData).forEach((key) => {
      const value = widgetData[key];
      if (value === 'Label') {
        labels.push(key);
      }
      if (value === 'Values') {
        values.push(key);
      }
    });

    return { labels, values };
  }

  /**
   * Transforms input data into bar chart data format with aggregated values
   */
  transformDataForBarChart(
    inputData: InputData,
    labels: string[],
    values: string[]
  ): BarChartDataResult {
    const chartData: ChartData<'bar', number[], string> = {
      labels: [],
      datasets: [{ data: [] }],
    };

    if (!labels.length || !values.length || !inputData.data.length) {
      console.log('No labels, values, or input data available for chart transformation');
      return { chartData, hasData: false };
    }

    // Process each row of data
    inputData.data.forEach((row) => {
      const rowObj = row as Record<string, unknown>;
      
      labels.forEach((labelCol) => {
        if (rowObj[labelCol] !== undefined) {
          const labelValue = String(rowObj[labelCol]);
          
          // Check if this label already exists in our chart data
          if (!chartData.labels?.includes(labelValue)) {
            chartData.labels?.push(labelValue);
            
            // Calculate sum of all values for this label
            let summedValue = 0;
            inputData.data
              // @ts-expect-error - Temporarily ignoring index signature error
              .filter((r) => r[labelCol] === rowObj[labelCol])
              .forEach((otherRow) => {
                // @ts-expect-error - Temporarily ignoring index signature error
                const value = Number(otherRow[values[0]] as unknown);
                if (!isNaN(value)) {
                  summedValue += value;
                }
              });

            chartData.datasets[0].data.push(summedValue);
          }
        }
      });
    });

    return {
      chartData,
      hasData: chartData.datasets[0].data.length > 0
    };
  }

  /**
   * Transforms input data into pie chart data format with aggregated values
   */
  transformDataForPieChart(
    inputData: InputData,
    labels: string[],
    values: string[]
  ): PieChartDataResult {
    const chartData: ChartData<'pie', number[], string> = {
      labels: [],
      datasets: [{ data: [] }],
    };

    if (!labels.length || !values.length || !inputData.data.length) {
      console.log('No labels, values, or input data available for chart transformation');
      return { chartData, hasData: false };
    }

    // Process each row of data (same logic as bar chart)
    inputData.data.forEach((row) => {
      const rowObj = row as Record<string, unknown>;
      
      labels.forEach((labelCol) => {
        if (rowObj[labelCol] !== undefined) {
          const labelValue = String(rowObj[labelCol]);
          
          // Check if this label already exists in our chart data
          if (!chartData.labels?.includes(labelValue)) {
            chartData.labels?.push(labelValue);
            
            // Calculate sum of all values for this label
            let summedValue = 0;
            inputData.data
              // @ts-expect-error - Temporarily ignoring index signature error
              .filter((r) => r[labelCol] === rowObj[labelCol])
              .forEach((otherRow) => {
                // @ts-expect-error - Temporarily ignoring index signature error
                const value = Number(otherRow[values[0]] as unknown);
                if (!isNaN(value)) {
                  summedValue += value;
                }
              });

            chartData.datasets[0].data.push(summedValue);
          }
        }
      });
    });

    return {
      chartData,
      hasData: chartData.datasets[0].data.length > 0
    };
  }

  /**
   * Complete data processing pipeline for bar charts
   */
  processBarChartData(
    widgetDataString: string,
    inputData: InputData
  ): BarChartDataResult {
    // Step 1: Parse widget data
    const widgetData = this.parseWidgetData(widgetDataString);
    
    if (!widgetData) {
      return {
        chartData: { labels: [], datasets: [{ data: [] }] },
        hasData: false
      };
    }

    // Step 2: Extract column mappings
    const { labels, values } = this.extractColumnMappings(widgetData);

    // Step 3: Transform data
    return this.transformDataForBarChart(inputData, labels, values);
  }

  /**
   * Complete data processing pipeline for pie charts
   */
  processPieChartData(
    widgetDataString: string,
    inputData: InputData
  ): PieChartDataResult {
    // Step 1: Parse widget data
    const widgetData = this.parseWidgetData(widgetDataString);
    
    if (!widgetData) {
      return {
        chartData: { labels: [], datasets: [{ data: [] }] },
        hasData: false
      };
    }

    // Step 2: Extract column mappings
    const { labels, values } = this.extractColumnMappings(widgetData);

    // Step 3: Transform data
    return this.transformDataForPieChart(inputData, labels, values);
  }
}