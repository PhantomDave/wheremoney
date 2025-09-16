import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { GridstackComponent, NgGridStackOptions, NgGridStackWidget } from 'gridstack/dist/angular';
import { Widget } from '../../../models/widget';
import { WidgetService } from '../../../services/widget/widget-service';
import { BarChartComponentComponent } from '../../widgets/charts/bar-chart-component/bar-chart-component.component';
import { PieChartComponent } from '../../widgets/charts/pie-chart-component/pie-chart-component';
import { WidgetWrapper } from '../../widgets/widget-wrapper/widget-wrapper';
import { DashboardDrawerComponent } from '../dashboard-drawer-component/dashboard-drawer-component';

@Component({
  selector: 'app-dashboard-component',
  // Include widget components so Angular can resolve and instantiate them
  // when Gridstack dynamically inserts them via the selector.
  imports: [GridstackComponent, MatIconModule, DashboardDrawerComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  private static gridstackRegistered = false;
  readonly widgetService = inject(WidgetService);

  isOpen = false;
  dashboardWidgets: NgGridStackWidget[] = [];

  constructor() {
    // Ensure we only register the component types with Gridstack once
    if (!DashboardComponent.gridstackRegistered) {
      GridstackComponent.addComponentToSelectorType([
        WidgetWrapper,
        PieChartComponent,
        BarChartComponentComponent,
      ]);
      DashboardComponent.gridstackRegistered = true;
    }
  }

  private readonly addedWidgetIds = new Set<string>();

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

  onWidgetChange() {
    // Here you could implement logic to save widget positions to the backend
  }

  onWidgetAdded() {
    // Placeholder for widget added event handling
  }

  onWidgetRemoved() {
    // Placeholder for widget removed event handling
  }

  ngOnInit(): void {
    // Load widgets from the API
    this.widgetService.getAllUserWidgets();

    // React to the widgets signal and add them to the Gridstack children
    const widgets = this.widgetService.widgets();
    if (!widgets || widgets.length === 0) return;

    // Build dashboardWidgets from widgets, avoiding duplicates
    const newChildren: NgGridStackWidget[] = [];
    for (const widget of widgets) {
      const id = widget.id?.toString() ?? `w-${Math.random().toString(36).slice(2, 9)}`;
      if (this.addedWidgetIds.has(id)) continue;
      this.addedWidgetIds.add(id);
      newChildren.push({
        x: 0,
        y: 0,
        w: 6,
        h: 4,
        minW: 3,
        minH: 3,
        maxW: 12,
        maxH: 8,
        id: id,
        selector: 'app-widget-wrapper',
        input: { widget: widget },
      });
    }

    if (newChildren.length > 0) {
      this.dashboardWidgets = [...this.dashboardWidgets, ...newChildren];
      this.gridOptions = {
        ...this.gridOptions,
        children: [...this.dashboardWidgets],
      };
    }
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
