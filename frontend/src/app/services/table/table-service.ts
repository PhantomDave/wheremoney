import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiWrapper } from '../api-wrapper';
import { environment } from '../../../environments/environment';
import { Account } from '../../models/account';
import { Table } from '../../models/table';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private readonly baseTableUrl = `${environment.apiUrl}/table`;

  private readonly _account = signal<Account | undefined>(undefined);
  private readonly _selectedAccount = signal<Account | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly account = this._account.asReadonly();
  public readonly selectedAccount = this._selectedAccount.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  constructor(private readonly api: ApiWrapper) {}

  public async createTable(table: Table) {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await firstValueFrom(this.api.post<Table>(`${this.baseTableUrl}/`, table, {}, true));
      console.log(response);
    }
    catch (error) {
      const apiError = error as any;
      if (apiError?.error?.message) {
        this._error.set(apiError.error.message);
      } else if (apiError?.message) {
        this._error.set(apiError.message);
      } else {
        this._error.set('Failed to create table');
      }
    } finally {
      this._loading.set(false);
    }
  }

  public async getAllUserTables() {
    this._loading.set(true);
    this._error.set(null);

    console.log(this.baseTableUrl)

    try {
      const response = await firstValueFrom(this.api.get<Table>(`${this.baseTableUrl}/`, {}, true));
      console.log(response);
    }
    catch (error) {
      const apiError = error as any;
      if (apiError?.error?.message) {
        this._error.set(apiError.error.message);
      } else if (apiError?.message) {
        this._error.set(apiError.message);
      } else {
        this._error.set('Failed to create table');
      }
    } finally {
      this._loading.set(false);
    }
  }
}
