import { Injectable, signal } from '@angular/core';
import { ApiWrapper } from '../api-wrapper';
import { environment } from '../../../environments/environment';
import { Table } from '../../models/table';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private readonly baseTableUrl = `${environment.apiUrl}/table`;

  private readonly _tables = signal<Table[] | undefined>(undefined);
  private readonly _selectedTable = signal<Table | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly selectedTable = this._selectedTable.asReadonly();
  public readonly tables = this._tables.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  constructor(private readonly api: ApiWrapper) {}

  public async createTable(table: Table): Promise<Table> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await firstValueFrom(
        this.api.post<Table>(`${this.baseTableUrl}/`, table, {}, true),
      );

      if (this._tables()) {
        this._tables.update((tables) => (tables ? [...tables, response] : [response]));
      } else {
        this._tables.set([response]);
      }

      this._selectedTable.set(response);

      return response;
    } catch (error) {
      const apiError = error as any;
      const errorMessage =
        apiError?.error?.message || apiError?.message || 'Failed to create table';
      this._error.set(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this._loading.set(false);
    }
  }

  public async getAllUserTables(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await firstValueFrom(
        this.api.get<Table[]>(`${this.baseTableUrl}/`, {}, true),
      );
      this._tables.set(response);
    } catch (error) {
      const apiError = error as any;
      const errorMessage = apiError?.error?.message || apiError?.message || 'Failed to get tables';
      this._error.set(errorMessage);
      this._tables.set([]);
    } finally {
      this._loading.set(false);
    }
  }

  public async getTableById(id: number): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await firstValueFrom(
        this.api.get<Table>(`${this.baseTableUrl}/${id}`, {}, true),
      );

      this._selectedTable.set(response);
    } catch (error) {
      const apiError = error as any;
      const errorMessage = apiError?.error?.message || apiError?.message || 'Table not found';
      this._error.set(errorMessage);
      this._selectedTable.set(null);
    } finally {
      this._loading.set(false);
    }
  }

  public async deleteTable(id: number): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(this.api.delete<void>(`${this.baseTableUrl}/${id}`, {}, true));

      this._tables.update((tables) => tables?.filter((table) => table.id !== id));
      if (this._selectedTable()?.id === id) {
        this._selectedTable.set(null);
      }
    } catch (error) {
      const apiError = error as any;
      const errorMessage =
        apiError?.error?.message || apiError?.message || 'Failed to delete table';
      this._error.set(errorMessage);
    } finally {
      this._loading.set(false);
    }
  }

  public selectTable(table: Table | null): void {
    this._selectedTable.set(table);
  }

  public clearError(): void {
    this._error.set(null);
  }
}
