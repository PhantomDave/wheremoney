import { Component, inject, OnInit, Signal, ChangeDetectionStrategy, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Flex } from '../../ui/flex/flex';
import { TableService } from '../../services/table/table-service';
import { Table } from '../../models/table';
import { ImportService } from '../../services/import/import-service';

@Component({
  selector: 'app-import-component',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    Flex,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './import-component.html',
  styleUrls: ['./import-component.css'],
})
export class ImportComponent implements OnInit {
  private tableService = inject(TableService);
  private fb = inject(FormBuilder);
  private importService = inject(ImportService);

  form = this.fb.group({
    table: [null, Validators.required],
    file: [null as File | null, Validators.required],
  });

  selectedFileName: WritableSignal<string> = signal('No file selected');

  async ngOnInit() {
    await this.tableService.getAllUserTables();
  }

  // NOTE: this getter returns a Signal, NOT an Observable.
  // - In templates access the value by calling the signal: tables$() or directly in bindings.
  // - Prefer NOT to use the "$" suffix for signals ("$" usually denotes Observables).
  // - If an Observable is needed (e.g. for libraries expecting one), convert with toObservable().
  get tables(): Signal<Table[]> {
    return this.tableService.tables;
  }

  // Called by the template when the file input changes
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;
    this.form.get('file')?.setValue(file);
    this.selectedFileName.set(file?.name ?? 'No file selected');
  }

  // Called by the template (ngSubmit)
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const table = this.form.get('table')?.value as number | null;
    const file = this.form.get('file')?.value as File | null;

    this.submit(file!, table!);
  }

  // Updated submit signature to accept a single File (or null)
  async submit(file: File, tableId: number): Promise<void> {
    console.log('submit', { fileName: file?.name ?? null, tableId });

    await this.importService.importFile(tableId, file)
  }

  reset(): void {
    this.form.reset();
    this.selectedFileName.set('No file selected');
  }
}
