import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';

export const loggedGuardGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const sessionJwt = cookieService.get('jwt_session');
  return !!sessionJwt;
};
