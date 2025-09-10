import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableService } from '../../../services/table/table-service';
import { isColumnType } from '../../../models/column';
import { Table } from '../../../models/table';
import { Router } from '@angular/router';

interface ColumnFormValue {
  name: string;
  type: string;
}

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
  styleUrl: './create-table-component.css',
})
export class CreateTableComponent {
  tableForm: FormGroup;
  readonly fb: FormBuilder = inject(FormBuilder);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly tableService: TableService = inject(TableService);
  private readonly router: Router = inject(Router);

  readonly dataTypes = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'date', label: 'Date' },
  ];

  constructor() {
    this.tableForm = this.fb.group({
      tableName: ['', Validators.required],
      columnCount: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
      columns: this.fb.array([this.createColumnGroup()]),
    });
    this.tableForm.get('columnCount')!.valueChanges.subscribe((c: number) => this.syncColumns(c));
  }

  get selectedTable() {
    return this.tableService.selectedTable;
  }

  get loading() {
    return this.tableService.loading;
  }

  get error() {
    return this.tableService.error;
  }

  get columns(): FormArray {
    return this.tableForm.get('columns') as FormArray;
  }

  createColumnGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      header: ['', Validators.required],
      type: ['string', Validators.required],
    });
  }

  addColumn(): void {
    this.columns.push(this.createColumnGroup());
    this.tableForm.patchValue({ columnCount: this.columns.length }, { emitEvent: false });
    this.cdr.detectChanges();
  }

  removeColumn(index: number): void {
    if (this.columns.length > 1) {
      this.columns.removeAt(index);
      this.tableForm.patchValue({ columnCount: this.columns.length }, { emitEvent: false });
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
    this.cdr.detectChanges();
  }

  async onSubmit(): Promise<void> {
    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    const tableModel: Table = {
      name: this.tableForm.value.tableName,
      columns: this.tableForm.value.columns.map((col: ColumnFormValue) => ({
        name: col.name,
        type: isColumnType(col.type) ? col.type : 'string',
      })),
    };

    try {
      const response = await this.tableService.createTable(tableModel);
      await this.router.navigate(['/table/', response.id]);
    } catch {
      this.cdr.detectChanges();
    }
  }
}
