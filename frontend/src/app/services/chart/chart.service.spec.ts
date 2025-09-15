import { TestBed } from '@angular/core/testing';
import { ChartService, ChartMappingResult, BarChartDataResult, PieChartDataResult } from './chart.service';
import { WidgetData } from '../../models/widget';
import { InputData } from '../../components/widgets/widget-wrapper/widget-wrapper';
import { Column } from '../../models/column';

describe('ChartService', () => {
  let service: ChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parseWidgetData', () => {
    it('should parse valid JSON widget data', () => {
      const validJson = '{"category": "Label", "value": "Values"}';
      const result = service.parseWidgetData(validJson);
      
      expect(result).toEqual({ category: 'Label', value: 'Values' });
    });

    it('should return null for invalid JSON', () => {
      const invalidJson = 'invalid json string';
      const result = service.parseWidgetData(invalidJson);
      
      expect(result).toBeNull();
    });

    it('should handle empty string', () => {
      const result = service.parseWidgetData('');
      
      expect(result).toBeNull();
    });
  });

  describe('extractColumnMappings', () => {
    it('should extract label and value columns correctly', () => {
      const widgetData: Record<string, string> = {
        category: 'Label',
        amount: 'Values',
        description: 'Other'
      };

      const result: ChartMappingResult = service.extractColumnMappings(widgetData);
      
      expect(result.labels).toEqual(['category']);
      expect(result.values).toEqual(['amount']);
    });

    it('should handle multiple label and value columns', () => {
      const widgetData: Record<string, string> = {
        category1: 'Label',
        category2: 'Label',
        amount1: 'Values',
        amount2: 'Values'
      };

      const result = service.extractColumnMappings(widgetData);
      
      expect(result.labels).toEqual(['category1', 'category2']);
      expect(result.values).toEqual(['amount1', 'amount2']);
    });

    it('should return empty arrays for null widget data', () => {
      const result = service.extractColumnMappings(null);
      
      expect(result.labels).toEqual([]);
      expect(result.values).toEqual([]);
    });
  });

  describe('transformDataForBarChart', () => {
    it('should transform data correctly for bar chart', () => {
      const mockColumns: Column[] = [
        { tableId: 1, name: 'category', data_type: 'string' },
        { tableId: 1, name: 'amount', data_type: 'number' }
      ];
      
      const inputData: InputData = {
        columns: mockColumns,
        data: [
          { category: 'Food', amount: 100 },
          { category: 'Transport', amount: 50 },
          { category: 'Food', amount: 25 }
        ]
      };
      const labels = ['category'];
      const values = ['amount'];

      const result: BarChartDataResult = service.transformDataForBarChart(
        inputData, 
        labels, 
        values
      );
      
      expect(result.hasData).toBe(true);
      expect(result.chartData.labels).toEqual(['Food', 'Transport']);
      expect(result.chartData.datasets[0].data).toEqual([125, 50]);
    });

    it('should return empty chart data when no labels provided', () => {
      const mockColumns: Column[] = [
        { tableId: 1, name: 'category', data_type: 'string' },
        { tableId: 1, name: 'amount', data_type: 'number' }
      ];
      
      const inputData: InputData = {
        columns: mockColumns,
        data: [{ category: 'Food', amount: 100 }]
      };

      const result = service.transformDataForBarChart(inputData, [], ['amount']);
      
      expect(result.hasData).toBe(false);
      expect(result.chartData.labels).toEqual([]);
      expect(result.chartData.datasets[0].data).toEqual([]);
    });

    it('should handle invalid numeric values gracefully', () => {
      const mockColumns: Column[] = [
        { tableId: 1, name: 'category', data_type: 'string' },
        { tableId: 1, name: 'amount', data_type: 'number' }
      ];
      
      const inputData: InputData = {
        columns: mockColumns,
        data: [
          { category: 'Food', amount: 'invalid' },
          { category: 'Transport', amount: 50 }
        ]
      };
      const labels = ['category'];
      const values = ['amount'];

      const result = service.transformDataForBarChart(inputData, labels, values);
      
      expect(result.hasData).toBe(true);
      expect(result.chartData.labels).toEqual(['Food', 'Transport']);
      expect(result.chartData.datasets[0].data).toEqual([0, 50]);
    });
  });

  describe('transformDataForPieChart', () => {
    it('should transform data correctly for pie chart', () => {
      const mockColumns: Column[] = [
        { tableId: 1, name: 'category', data_type: 'string' },
        { tableId: 1, name: 'amount', data_type: 'number' }
      ];
      
      const inputData: InputData = {
        columns: mockColumns,
        data: [
          { category: 'Food', amount: 100 },
          { category: 'Transport', amount: 50 },
          { category: 'Food', amount: 25 }
        ]
      };
      const labels = ['category'];
      const values = ['amount'];

      const result: PieChartDataResult = service.transformDataForPieChart(
        inputData, 
        labels, 
        values
      );
      
      expect(result.hasData).toBe(true);
      expect(result.chartData.labels).toEqual(['Food', 'Transport']);
      expect(result.chartData.datasets[0].data).toEqual([125, 50]);
    });
  });

  describe('processBarChartData', () => {
    it('should process bar chart data end-to-end', () => {
      const widgetDataString = '{"category": "Label", "amount": "Values"}';
      const mockColumns: Column[] = [
        { tableId: 1, name: 'category', data_type: 'string' },
        { tableId: 1, name: 'amount', data_type: 'number' }
      ];
      
      const inputData: InputData = {
        columns: mockColumns,
        data: [
          { category: 'Food', amount: 100 },
          { category: 'Transport', amount: 50 }
        ]
      };

      const result = service.processBarChartData(widgetDataString, inputData);
      
      expect(result.hasData).toBe(true);
      expect(result.chartData.labels).toEqual(['Food', 'Transport']);
      expect(result.chartData.datasets[0].data).toEqual([100, 50]);
    });

    it('should handle invalid widget data string', () => {
      const mockColumns: Column[] = [
        { tableId: 1, name: 'category', data_type: 'string' },
        { tableId: 1, name: 'amount', data_type: 'number' }
      ];
      
      const inputData: InputData = {
        columns: mockColumns,
        data: [{ category: 'Food', amount: 100 }]
      };

      const result = service.processBarChartData('invalid json', inputData);
      
      expect(result.hasData).toBe(false);
      expect(result.chartData.labels).toEqual([]);
      expect(result.chartData.datasets[0].data).toEqual([]);
    });
  });

  describe('processPieChartData', () => {
    it('should process pie chart data end-to-end', () => {
      const widgetDataString = '{"category": "Label", "amount": "Values"}';
      const mockColumns: Column[] = [
        { tableId: 1, name: 'category', data_type: 'string' },
        { tableId: 1, name: 'amount', data_type: 'number' }
      ];
      
      const inputData: InputData = {
        columns: mockColumns,
        data: [
          { category: 'Food', amount: 100 },
          { category: 'Transport', amount: 50 }
        ]
      };

      const result = service.processPieChartData(widgetDataString, inputData);
      
      expect(result.hasData).toBe(true);
      expect(result.chartData.labels).toEqual(['Food', 'Transport']);
      expect(result.chartData.datasets[0].data).toEqual([100, 50]);
    });
  });
});