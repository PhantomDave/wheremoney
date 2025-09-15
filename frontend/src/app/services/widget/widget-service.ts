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

  async getWidgetById(id: number) {
    this._loading.set(true);
    this._error.set(null);
    try {
      const response = await firstValueFrom(
        this.api.get<Widget>(`${this.baseWidgetUrl}/${id}`, {}, true),
      );
      this._selectedWidget.set(response);
    } catch (error) {
      this._error.set('Failed to load widget');
      console.error('Error fetching widget:', error);
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
      this._widgets.update((widgets) => [...widgets, response]);
      return response;
    } catch (error) {
      this._error.set('Failed to create widget');
      console.error('Error creating widget:', error);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async updateWidget(widget: Widget) {
    this._loading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(
        this.api.put<Widget>(`${this.baseWidgetUrl}/${widget.id}`, widget, {}, true),
      );
    } catch (error) {
      this._error.set('Failed to update widget');
      console.error('Error updating widget:', error);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async deleteWidget(id: number) {
    this._loading.set(true);
    this._error.set(null);
    try {
      await firstValueFrom(this.api.delete(`${this.baseWidgetUrl}/${id}`, {}, true));
      this._widgets.update((widgets) => widgets.filter((widget) => widget.id !== id));
    } catch (error) {
      this._error.set('Failed to delete widget');
      console.error('Error deleting widget:', error);
    } finally {
      this._loading.set(false);
    }
  }
}
