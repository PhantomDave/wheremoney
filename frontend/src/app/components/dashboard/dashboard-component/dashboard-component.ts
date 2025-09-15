import { Component } from '@angular/core';
import { GridstackComponent, NgGridStackOptions } from 'gridstack/dist/angular';
import { BarChartComponentComponent } from '../../widgets/charts/bar-chart-component/bar-chart-component.component';
import { PieChartComponent } from '../../widgets/charts/pie-chart-component/pie-chart-component';
import { WidgetWrapper } from '../../widgets/widget-wrapper/widget-wrapper';
import { Widget, WidgetType } from '../../../models/widget';

@Component({
  selector: 'app-dashboard-component',
  imports: [GridstackComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  public sampleWidgets: Widget[] = [
    {
      id: 1,
      name: 'Sales Overview',
      description: 'Monthly sales data visualization',
      type: WidgetType.PIE_CHART,
      widget_data: JSON.stringify({ category: 'month', value: 'sales_amount' }),
      table_id: 1,
      user_id: 1,
    },
    {
      id: 2,
      name: 'Revenue Trends',
      description: 'Revenue trends over time',
      type: WidgetType.BAR_CHART,
      widget_data: JSON.stringify({ category: 'quarter', value: 'revenue' }),
      table_id: 2,
      user_id: 1,
    },
  ];

  constructor() {
    GridstackComponent.addComponentToSelectorType([
      WidgetWrapper,
      PieChartComponent,
      BarChartComponentComponent,
    ]);
  }

  public gridOptions: NgGridStackOptions = {
    margin: 5,
    minRow: 1,
    animate: true,
    children: [
      {
        x: 0,
        y: 0,
        w: 6,
        h: 4,
        selector: 'app-widget-wrapper',
        input: { widget: this.sampleWidgets[0] },
      },
      {
        x: 6,
        y: 0,
        w: 6,
        h: 4,
        selector: 'app-widget-wrapper',
        input: { widget: this.sampleWidgets[1] },
      },
    ],
  };
}
