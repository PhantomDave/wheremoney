import { inject, Injectable } from '@angular/core';
import { ApiWrapper } from '../api-wrapper';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  readonly api = inject(ApiWrapper);
  readonly baseImportUrl = `${environment.apiUrl}/import`;

  async importFile(tableId: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tableId', tableId.toString());

    try {
      await firstValueFrom(this.api.post<void>(`${this.baseImportUrl}/xlsx`, formData, {}, true));
    } catch (error) {
      const apiError = error as any;
      const errorMessage = apiError?.error?.message || apiError?.message || 'Failed to import file';
      throw new Error(errorMessage);
    }
  }
}
