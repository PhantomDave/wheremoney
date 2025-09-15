import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { ChartService } from '../../../../services/chart/chart.service';
import { BarChartComponentComponent } from './bar-chart-component.component';
import { WidgetType } from '../../../../models/widget';

describe('BarChartComponentComponent', () => {
  let component: BarChartComponentComponent;
  let fixture: ComponentFixture<BarChartComponentComponent>;
  let componentRef: ComponentRef<BarChartComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponentComponent],
      providers: [ChartService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarChartComponentComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    
    // Set required inputs using setInput
    componentRef.setInput('widget', {
      id: 1,
      name: 'Test Bar Chart',
      type: WidgetType.BAR_CHART,
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
    expect(component.barChartData).toBeTruthy();
    expect(component.hasData).toBeTruthy();
  });
});
