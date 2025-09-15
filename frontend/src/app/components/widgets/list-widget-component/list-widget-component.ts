import { Component, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Flex } from '../../ui/flex/flex';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WidgetService } from '../../../services/widget/widget-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-widget-component',
  imports: [MatListModule, MatProgressSpinner, Flex, MatButton, MatIconModule, RouterLink],
  templateUrl: './list-widget-component.html',
  styleUrl: './list-widget-component.css',
})
export class ListWidgetComponent implements OnInit {
  readonly widgetService = inject(WidgetService);

  ngOnInit(): void {
    this.widgetService.getAllUserWidgets();
  }

  get widgets() {
    return this.widgetService.widgets();
  }

  get loading() {
    return this.widgetService.loading();
  }

  onDeleteWidget(id: number) {
    console.log('Delete widget with id:', id);
    this.widgetService.deleteWidget(id);
  }
}
