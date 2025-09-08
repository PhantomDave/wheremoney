import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

export const unauthorizedHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if (err?.status === 401) {
        try {
          cookieService.delete('jwt_session', '/');
          cookieService.delete('jwt_session');
        } catch (e) {}

        try {
          cookieService.set('jwt_session', '', new Date(0), '/');
        } catch (e) {}

        try {
          router.navigate(['/account/login']).then();
        } catch (e) {}
      }

      return throwError(() => err);
    }),
  );
};
