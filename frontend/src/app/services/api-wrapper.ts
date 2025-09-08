import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ApiWrapper {
  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService,
  ) {}

  get<T>(url: string, options?: any, withCredentials?: boolean) {
    return this.request<T>('GET', url, undefined, options, withCredentials);
  }

  post<T>(url: string, body: any, options?: any, withCredentials?: boolean) {
    return this.request<T>('POST', url, body, options, withCredentials);
  }

  put<T>(url: string, body: any, options?: any, withCredentials?: boolean) {
    return this.request<T>('PUT', url, body, options, withCredentials);
  }

  delete<T>(url: string, options?: any, withCredentials?: boolean) {
    return this.request<T>('DELETE', url, undefined, options, withCredentials);
  }

  patch<T>(url: string, body: any, options?: any, withCredentials?: boolean) {
    return this.request<T>('PATCH', url, body, options, withCredentials);
  }

  request<T>(method: string, url: string, body?: any, options?: any, withCredentials?: boolean) {
    method = method.toUpperCase();

    if (method === 'GET' || method === 'DELETE') {
      if (body) {
        throw new Error('GET and DELETE requests cannot have a body');
      }
    } else {
      if (!body) {
        throw new Error('POST and PUT requests must have a body');
      }
    }

    if (!options) {
      options = {};
    }

    if (!options?.params) {
      options.params = {};
    }

    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json');
    if (withCredentials) header = header.set('Bearer', this.cookieService.get('jwt_session'));
    options.body = body;
    options.headers = header;
    return this.http.request<T>(method, url, options) as Observable<T>;
  }
}
