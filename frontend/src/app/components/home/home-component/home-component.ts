import { Component } from '@angular/core';
import { PieChartComponent } from '../../charts/pie-chart-component/pie-chart-component';
import { PieChartWidget } from '../../widgets/pie-chart-widget/pie-chart-widget';
import { WidgetWrapper } from '../../widgets/widget-wrapper/widget-wrapper';

@Component({
  selector: 'app-home-component',
  imports: [PieChartComponent, PieChartWidget, WidgetWrapper],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent {}
