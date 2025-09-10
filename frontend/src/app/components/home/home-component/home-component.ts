import { Component } from '@angular/core';
import { PieChartComponent } from '../../charts/pie-chart-component/pie-chart-component';
import { PieChartWidget } from '../../widgets/pie-chart-widget/pie-chart-widget';

@Component({
  selector: 'app-home-component',
  imports: [PieChartComponent, PieChartWidget],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent {}
