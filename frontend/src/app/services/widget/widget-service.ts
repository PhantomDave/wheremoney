import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Widget } from '../../models/widget';
import { ApiWrapper } from '../api-wrapper';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  private readonly api = inject(ApiWrapper);
  private readonly baseWidgetUrl = `${environment.apiUrl}/widget`;

  private readonly _widgets = signal<Widget[]>([]);
  private readonly _selectedWidget = signal<Widget | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public readonly selectedWidget = this._selectedWidget.asReadonly();
  public readonly widgets = this._widgets.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  async getAllUserWidgets() {
    this._loading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(this.api.get<Widget[]>(this.baseWidgetUrl, {}, true));
      this._widgets.set(response);
    } catch (error) {
      this._error.set('Failed to load widgets');
      console.error('Error fetching widgets:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async createWidget(widget: Widget) {
    this._loading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(
        this.api.post<Widget>(`${this.baseWidgetUrl}`, widget, {}, true),
      );
      return response;
    } catch (error) {
      this._error.set('Failed to create widget');
      console.error('Error creating widget:', error);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  // deleteWidget(id: number) {}

  // updateWidget(widget: Widget) {}
}
