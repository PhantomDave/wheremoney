import { Component } from '@angular/core';
import { WidgetWrapper } from '../../widgets/widget-wrapper/widget-wrapper';

@Component({
  selector: 'app-home-component',
  imports: [WidgetWrapper],
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css'],
})
export class HomeComponent {}
