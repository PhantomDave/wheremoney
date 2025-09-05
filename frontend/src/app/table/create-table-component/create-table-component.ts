import { Component, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-create-table-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './create-table-component.html',
  styles: [
    `
      :host {
        display: block;
        padding: 16px;
        box-sizing: border-box;
      }
      .create-table h2 {
        margin: 0 0 12px 0;
      }
      .row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }
      .row label {
        width: 160px;
        font-weight: 600;
      }
      .row input[type='text'],
      .row input[type='number'],
      .column select {
        flex: 1 1 auto;
        padding: 6px 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
      }
      .columns {
        margin-top: 8px;
      }
      .column-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .column {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .column input[type='text'] {
        flex: 1 1 40%;
      }
      .column select {
        flex: 1 1 30%;
        padding: 6px 8px;
      }
      .column-actions {
        margin-top: 8px;
      }
      .actions {
        margin-top: 16px;
      }
      /* Keep button spacing but don't override Material styles so theme applies */
      .actions button,
      .column-actions button {
        padding: 8px 12px;
        border-radius: 4px;
      }

      /* mat-icon-button spacing (no color overrides) */
      .column mat-icon-button {
        margin-left: 4px;
      }
    `,
  ],
})
export class CreateTableComponent {
  tableForm: FormGroup;

  readonly dataTypes = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'date', label: 'Date' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.tableForm = this.fb.group({
      tableName: ['', Validators.required],
      columnCount: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
      columns: this.fb.array([this.createColumnGroup()]),
    });

    // keep columns in sync when user changes the numeric columnCount
    this.tableForm.get('columnCount')!.valueChanges.subscribe((c: number) => this.syncColumns(c));
  }

  get columns(): FormArray {
    return this.tableForm.get('columns') as FormArray;
  }

  createColumnGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['string', Validators.required],
    });
  }

  addColumn(): void {
    this.columns.push(this.createColumnGroup());
    this.tableForm.patchValue({ columnCount: this.columns.length }, { emitEvent: false });
    // ensure Angular runs change detection so newly pushed controls get rendered
    // and their component-scoped styles / Material styling take effect immediately
    this.cdr.detectChanges();
  }

  removeColumn(index: number): void {
    if (this.columns.length > 1) {
      this.columns.removeAt(index);
      this.tableForm.patchValue({ columnCount: this.columns.length }, { emitEvent: false });
      // run change detection after removing
      this.cdr.detectChanges();
    }
  }

  private syncColumns(count: number): void {
    const desired = Math.max(1, Math.min(50, Math.floor(Number(count) || 1)));
    const current = this.columns.length;
    if (desired > current) {
      for (let i = current; i < desired; i++) this.columns.push(this.createColumnGroup());
    } else if (desired < current) {
      for (let i = current - 1; i >= desired; i--) this.columns.removeAt(i);
    }
    // after structural changes, ensure view updates immediately
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    // For now, just log the form value. In a real app you'd send this to a service.
    // Keep the output readable for debugging.
    // eslint-disable-next-line no-console
    console.log('Create table payload:', JSON.stringify(this.tableForm.value, null, 2));
  }
}
