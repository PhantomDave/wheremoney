import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { WidgetWrapper } from '../widget-wrapper/widget-wrapper';
import { WidgetService } from '../../../services/widget/widget-service';
import { TableService } from '../../../services/table/table-service';

@Component({
  selector: 'app-widget-details-component',
  imports: [WidgetWrapper],
  templateUrl: './widget-details-component.html',
  styleUrl: './widget-details-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetDetailsComponent implements OnInit {
  readonly widgetService = inject(WidgetService);
  readonly tableService = inject(TableService);
  readonly activatedRoute = inject(ActivatedRoute);

  get table() {
    return this.tableService.selectedTable();
  }

  get loading() {
    return this.tableService.loading() && this.widgetService.loading();
  }

  get error() {
    return this.tableService.error() || this.widgetService.error();
  }

  get widget() {
    return this.widgetService.selectedWidget();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      const widgetId = Number(params['id']);
      await this.widgetService.getWidgetById(widgetId);
      if (this.widget?.table_id) {
        await this.tableService.getTableById(this.widget.table_id);
      }
    });
  }
}
