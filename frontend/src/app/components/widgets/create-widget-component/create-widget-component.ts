import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Flex } from '../../ui/flex/flex';
import { MatCardModule } from '@angular/material/card';
import { WidgetService } from '../../../services/widget/widget-service';
import { Widget, WidgetType } from '../../../models/widget';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-widget-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    Flex,
    MatCardModule,
    MatSelectModule,
  ],
  templateUrl: './create-widget-component.html',
  styleUrl: './create-widget-component.css',
})
export class CreateWidgetComponent {
  readonly fb: FormBuilder = inject(FormBuilder);
  readonly widgetService = inject(WidgetService);
  readonly router = inject(Router);

  widgetTypes = Object.values(WidgetType);

  widgetForm: FormGroup;

  constructor() {
    this.widgetForm = this.fb.group({
      name: ['', Validators.required],
      type: [WidgetType.PIE_CHART, Validators.required],
    });
  }

  onChartTypeChange(type: WidgetType) {
    this.widgetForm.patchValue({ type });
  }

  async onSubmit(): Promise<void> {
    if (this.widgetForm.invalid) {
      this.widgetForm.markAllAsTouched();
      return;
    }

    const payload = this.widgetForm.value;
    const widget: Widget = {
      name: payload.name,
      type: payload.type,
      widget_data: '',
    };
    const createdWidget = await this.widgetService.createWidget(widget);
    this.widgetForm.reset();

    await this.router.navigate([`/widgets/${createdWidget.id}`]);
  }
}
