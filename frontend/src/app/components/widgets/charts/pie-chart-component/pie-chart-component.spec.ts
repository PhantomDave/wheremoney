import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartComponent } from './pie-chart-component';
import { Widget, WidgetType } from '../../../../models/widget';
import { Column } from '../../../../models/column';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    
    // Set up mock data for testing
    component.widget = {
      id: 1,
      name: 'Test Pie Chart',
      type: WidgetType.PIE_CHART,
      widget_data: '{"Revenue": "Sum", "Profit": "Average", "Orders": "Count"}'
    };
    
    component.data = {
      columns: [
        { id: 1, name: 'Revenue', data_type: 'number', tableId: 1 },
        { id: 2, name: 'Profit', data_type: 'number', tableId: 1 },
        { id: 3, name: 'Orders', data_type: 'number', tableId: 1 }
      ] as Column[],
      data: [
        { Revenue: 100, Profit: 20, Orders: 5 },
        { Revenue: 200, Profit: 40, Orders: 8 },
        { Revenue: 150, Profit: 30, Orders: 6 }
      ]
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map widget data correctly', () => {
    const widgetData = component.mapWidgetData();
    expect(widgetData).toEqual([
      { category: 'Revenue', value: 'Sum' },
      { category: 'Profit', value: 'Average' },
      { category: 'Orders', value: 'Count' }
    ]);
  });

  it('should update chart data with all mapped values', () => {
    // Trigger the chart data update
    component.ngAfterViewInit();
    
    // Check that labels are populated correctly
    expect(component.pieChartDataObj.labels).toEqual(['Revenue', 'Profit', 'Orders']);
    
    // Check that data values are calculated correctly
    const [revenue, profit, orders] = component.pieChartDataObj.datasets[0].data;
    
    // Revenue should be sum: 100 + 200 + 150 = 450
    expect(revenue).toBe(450);
    
    // Profit should be average: (20 + 40 + 30) / 3 = 30
    expect(profit).toBe(30);
    
    // Orders should be count: 3 (number of rows)
    expect(orders).toBe(3);
  });

  it('should handle empty data gracefully', () => {
    component.data = { columns: [], data: [] };
    component.ngAfterViewInit();
    
    expect(component.pieChartDataObj.labels).toEqual([]);
    expect(component.pieChartDataObj.datasets[0].data).toEqual([]);
  });

  it('should handle invalid widget data gracefully', () => {
    component.widget = {
      id: 1,
      name: 'Test Pie Chart',
      type: WidgetType.PIE_CHART,
      widget_data: 'invalid json'
    };
    
    const widgetData = component.mapWidgetData();
    expect(widgetData).toEqual([]);
  });
});
