import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {Account, AuthResponse} from '../../models/profile/account';
import {environment} from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import {ApiWrapper} from '../api-wrapper';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly baseAuthUrl = `${environment.apiUrl}/auth`; // Placeholder API URL

  private _account = signal<Account | undefined>(undefined);
  private _selectedAccount = signal<Account | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  public readonly account = this._account.asReadonly();
  public readonly selectedAccount = this._selectedAccount.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  constructor(private api: ApiWrapper, private cookieService: CookieService) { }

  async createAccount(account: Account): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await firstValueFrom(this.api.post<Account>(`${this.baseAuthUrl}/register`, account));
      if (response) {
        this._account.set(response);
      }
    } catch (error) {
      this._error.set('Failed to create _account');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async updateAccount(id: string, account: Account): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      account.updatedAt = new Date();
      const updatedAccount = await firstValueFrom(this.api.put<Account>(`${this.baseAuthUrl}/${id}`, account));

      if (updatedAccount) {
        this._account.set(updatedAccount);
        if (this._selectedAccount()?.id === id) {
          this._selectedAccount.set(updatedAccount);
        }
      }
    } catch (error) {
      this._error.set('Failed to update _account');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async deleteAccount(id: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      await firstValueFrom(this.api.delete<void>(`${this.baseAuthUrl}/${id}`));
      if (this._account()?.id === id) {
        this._account.set(undefined);
      }
      if (this._selectedAccount()?.id === id) {
        this._selectedAccount.set(null);
      }
    } catch (error) {
      this._error.set('Failed to delete _account');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async loginAccount(email: string, password: string): Promise<AuthResponse> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const isValid = await firstValueFrom(this.api.post<AuthResponse>(`${this.baseAuthUrl}/login`, {
        email,
        password
      }));

      if(isValid && isValid.token) {
        this._selectedAccount.set(isValid.account);
      }

      return isValid || false;
    } catch (error) {
      this._error.set('Failed to validate login');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  setLoggedIn(token: string): void {
    if(this.cookieService.get("jwt_session")) {
      this.cookieService.delete("jwt_session", "/");
    }
    this.cookieService.set("jwt_session", token, 3600, "/");
  }

}
