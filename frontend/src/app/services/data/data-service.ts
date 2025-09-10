import { inject, Injectable, signal } from '@angular/core';
import { ApiWrapper } from '../api-wrapper';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../../models/api-error';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  readonly api = inject(ApiWrapper);

  private readonly _data = signal<unknown[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly data = this._data.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  async getDataByTableId(tableId: number): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await firstValueFrom(
        this.api.get<unknown>(`${environment.apiUrl}/data/${tableId}`, {}, true),
      );
      if (response) {
        if (Array.isArray(response)) {
          this._data.set(response);
        } else {
          this._data.set([]);
        }
      }
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.error?.message) {
        this._error.set(apiError.error.message);
      } else if (apiError?.message) {
        this._error.set(apiError.message);
      } else {
        this._error.set('Failed to fetch data');
      }
    } finally {
      this._loading.set(false);
    }
  }
}
