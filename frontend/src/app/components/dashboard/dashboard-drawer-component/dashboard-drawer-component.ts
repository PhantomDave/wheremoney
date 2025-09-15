import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Flex } from '../../ui/flex/flex';
import { Widget } from '../../../models/widget';
import { DashboardDrawerWidget } from '../dashboard-drawer-widget/dashboard-drawer-widget';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-drawer-component',
  imports: [MatSidenavModule, Flex, MatIconModule, RouterLink, DashboardDrawerWidget],
  templateUrl: './dashboard-drawer-component.html',
  styleUrl: './dashboard-drawer-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDrawerComponent {
  isOpen = input<boolean>(false);
  widgets = input<Widget[]>([]);

  addWidgetToDashboardEvent = output<Widget>();
  toggleDrawerEvent = output<void>();

  onAddWidgetToDashboard(widget: Widget) {
    this.addWidgetToDashboardEvent.emit(widget);
  }

  toggleDrawer() {
    this.toggleDrawerEvent.emit();
  }
}
