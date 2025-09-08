import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const anonymousGuardGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const sessionJwt = cookieService.get('jwt_session');
  console.log(sessionJwt);
  if (sessionJwt) {
    return router.createUrlTree(['/home']);
  }
  return sessionJwt === '' || sessionJwt === null || sessionJwt === undefined;
};
