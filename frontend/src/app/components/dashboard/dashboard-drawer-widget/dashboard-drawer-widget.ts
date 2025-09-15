import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Widget } from '../../../models/widget';
import { MatCard } from '@angular/material/card';
import { Flex } from '../../ui/flex/flex';

@Component({
  selector: 'app-dashboard-drawer-widget',
  imports: [MatCard, Flex],
  templateUrl: './dashboard-drawer-widget.html',
  styleUrl: './dashboard-drawer-widget.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDrawerWidget {
  widget = input<Widget>();

  addWidgetToDashboardEvent = output<Widget>();

  addWidgetToDashboard(widget: Widget) {
    this.addWidgetToDashboardEvent.emit(widget);
  }
}
