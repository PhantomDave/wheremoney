import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WidgetService } from '../../../services/widget/widget-service';
import { WidgetWrapper } from '../widget-wrapper/widget-wrapper';

@Component({
  selector: 'app-widget-details-component',
  imports: [WidgetWrapper],
  templateUrl: './widget-details-component.html',
  styleUrl: './widget-details-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetDetailsComponent implements OnInit {
  readonly widgetService = inject(WidgetService);
  readonly activatedRoute = inject(ActivatedRoute);

  get loading() {
    return this.widgetService.loading();
  }

  get error() {
    return this.widgetService.error();
  }

  get widget() {
    return this.widgetService.selectedWidget();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      const widgetId = Number(params['id']);
      await this.widgetService.getWidgetById(widgetId);
    });
  }
}
