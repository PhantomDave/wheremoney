// noinspection ExceptionCaughtLocallyJS

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';


export interface ApiRequestOptions {
  headers?: Record<string, string> | HttpHeaders;
  params?: Record<string, string | number | boolean>;
  observe?: 'body' | 'events' | 'response';
  reportProgress?: boolean;
  responseType?: 'json' | 'arraybuffer' | 'blob' | 'text';
  withCredentials?: boolean;
  body?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class ApiWrapper {
  private readonly http = inject(HttpClient);
  private readonly cookieService = inject(CookieService);

  get<T>(url: string, options?: ApiRequestOptions, withCredentials?: boolean) {
    return this.request<T>('GET', url, undefined, options, withCredentials);
  }

  post<T>(url: string, body: unknown, options?: ApiRequestOptions, withCredentials?: boolean)  {
    return this.request<T>('POST', url, body, options, withCredentials);
  }

  put<T>(url: string, body: unknown, options?: ApiRequestOptions, withCredentials?: boolean) {
    return this.request<T>('PUT', url, body, options, withCredentials);
  }

  delete<T>(url: string, options?: ApiRequestOptions, withCredentials?: boolean) {
    return this.request<T>('DELETE', url, undefined, options, withCredentials);
  }

  patch<T>(url: string, body: unknown, options?: ApiRequestOptions, withCredentials?: boolean) {
    return this.request<T>('PATCH', url, body, options, withCredentials);
  }

  request<T>(method: string, url: string, body?: unknown, options?: ApiRequestOptions, withCredentials?: boolean) {
   try {

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

    let headers: HttpHeaders;
    if (options.headers instanceof HttpHeaders) {
      headers = options.headers;
    } else if (options.headers) {
      headers = new HttpHeaders(options.headers);
    } else {
      headers = new HttpHeaders();
    }

     if (!headers.has('Content-Type') && !(body instanceof FormData)) {
       headers = headers.set('Content-Type', 'application/json');
     }

    const jwt = this.cookieService.get('jwt_session');

    if (withCredentials) {
      if (!jwt) {
        throw new Error('Unauthorized');
      }
      headers = headers.set('Authorization', `Bearer ${jwt}`);
      options.withCredentials = true;
    }

    options.body = body;
    options.headers = headers;
    
    // Simplified options without conflicting observe types
    const httpOptions: Record<string, unknown> = {
      headers: options.headers,
      body: options.body,
    };
    
    if (options.params) {
      httpOptions['params'] = options.params;
    }
    if (options.reportProgress !== undefined) {
      httpOptions['reportProgress'] = options.reportProgress;
    }
    if (options.withCredentials !== undefined) {
      httpOptions['withCredentials'] = options.withCredentials;
    }
    
    return this.http.request<T>(method, url, httpOptions) as Observable<T>;
   }
    catch (error) {
     // Log error appropriately and re-throw for handling by calling code
     if (error instanceof Error) {
       throw new Error(`API request failed: ${error.message}`);
     }
     throw new Error('An unexpected error occurred during API request');
    }
  }

}
