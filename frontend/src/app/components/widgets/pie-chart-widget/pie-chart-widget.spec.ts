import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartWidget } from './pie-chart-widget';

describe('PieChartWidget', () => {
  let component: PieChartWidget;
  let fixture: ComponentFixture<PieChartWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
