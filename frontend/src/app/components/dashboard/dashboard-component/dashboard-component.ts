import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridstackComponent, NgGridStackOptions, NgGridStackWidget } from 'gridstack/dist/angular';
import { Widget } from '../../../models/widget';
import { BarChartComponentComponent } from '../../widgets/charts/bar-chart-component/bar-chart-component.component';
import { PieChartComponent } from '../../widgets/charts/pie-chart-component/pie-chart-component';
import { WidgetWrapper } from '../../widgets/widget-wrapper/widget-wrapper';
import { DashboardDrawerComponent } from '../dashboard-drawer-component/dashboard-drawer-component';
import { WidgetService } from '../../../services/widget/widget-service';

@Component({
  selector: 'app-dashboard-component',
  imports: [GridstackComponent, MatIconModule, DashboardDrawerComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  readonly widgetService = inject(WidgetService);

  isOpen = false;
  dashboardWidgets: NgGridStackWidget[] = [];

  constructor() {
    GridstackComponent.addComponentToSelectorType([
      WidgetWrapper,
      PieChartComponent,
      BarChartComponentComponent,
    ]);
  }

  addWidgetToDashboard(widget: Widget) {
    const dashboardWidget: NgGridStackWidget = {
      x: 0,
      y: 0,
      w: 6,
      h: 4,
      minW: 3,
      minH: 3,
      maxW: 12,
      maxH: 8,
      id: widget.id?.toString(),
      selector: 'app-widget-wrapper',
      input: { widget: widget },
    };
    this.dashboardWidgets.push(dashboardWidget);
    this.gridOptions = {
      ...this.gridOptions,
      children: [...this.dashboardWidgets],
    };
    this.isOpen = false;
  }

  toggleDrawer() {
    this.isOpen = !this.isOpen;
  }

  onWidgetChange(event: Event) {
    console.log('Widget changed:', event);
    // Here you could implement logic to save widget positions to the backend
  }

  onWidgetAdded(event: Event) {
    console.log('Widget added:', event);
  }

  onWidgetRemoved(event: Event) {
    console.log('Widget removed:', event);
  }

  ngOnInit(): void {
    this.widgetService.getAllUserWidgets();
  }

  get widgets(): Widget[] {
    return this.widgetService.widgets();
  }

  get loading(): boolean {
    return this.widgetService.loading();
  }

  public gridOptions: NgGridStackOptions = {
    margin: 8,
    minRow: 1,
    cellHeight: 60, // Set a specific cell height for better sizing
    animate: true,
    acceptWidgets: true,
    float: true,
    staticGrid: false,
    disableDrag: false,
    disableResize: false,
    handle: '.drag-handle',
    resizable: {
      handles: 'e, se, s, sw, w', // Enable resize handles on all sides except north
    },
    children: [],
  };
}
