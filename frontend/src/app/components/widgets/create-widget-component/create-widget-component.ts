import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Flex } from '../../ui/flex/flex';
import { MatCardModule } from '@angular/material/card';
import { WidgetService } from '../../../services/widget/widget-service';
import { Widget } from '../../../models/widget';

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
  ],
  templateUrl: './create-widget-component.html',
  styleUrl: './create-widget-component.css',
})
export class CreateWidgetComponent {
  readonly fb: FormBuilder = inject(FormBuilder);

  readonly widgetService = inject(WidgetService);

  widgetForm: FormGroup;

  constructor() {
    this.widgetForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
    });
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
      data: '',
    };
    this.widgetService.createWidget(widget);
    this.widgetForm.reset();
  }
}
