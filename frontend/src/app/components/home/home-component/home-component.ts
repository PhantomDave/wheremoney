import { Component } from '@angular/core';
import { PieChartComponent } from '../../charts/pie-chart-component/pie-chart-component';

@Component({
  selector: 'app-home-component',
  imports: [PieChartComponent],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent {}
