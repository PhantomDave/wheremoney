import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ChartService } from '../../../../services/chart/chart.service';
import { PieChartComponent } from './pie-chart-component';
import { WidgetType } from '../../../../models/widget';

describe('PieChartComponent', () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;
  let componentRef: ComponentRef<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartComponent],
      providers: [ChartService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    
    // Set required inputs using setInput
    componentRef.setInput('widget', {
      id: 1,
      name: 'Test Pie Chart',
      type: WidgetType.PIE_CHART,
      widget_data: '{"category": "Label", "amount": "Values"}'
    });
    
    componentRef.setInput('table', {
      id: 1,
      name: 'Test Table',
      user_id: 1
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have chart service injected', () => {
    expect(component['chartService']).toBeTruthy();
  });

  it('should have computed chart data', () => {
    expect(component.pieChartData).toBeTruthy();
    expect(component.hasData).toBeTruthy();
  });

  it('should compute label count', () => {
    expect(component.labelCount).toBeTruthy();
  });
});