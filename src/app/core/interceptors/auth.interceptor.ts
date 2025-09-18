import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError, Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const http = inject(HttpClient);

  let authReq = req;

  // ✅ On n'ajoute pas le token sur /auth/login ni /auth/refresh
  if (!req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
    const token = authService.getToken();
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          authService.logout();
          return throwError(() => err);
        }

        // ⚡ Tente un refresh
        return http.post<{ token: string; refreshToken: string }>(
          '/api/auth/refresh',
          { refreshToken }
        ).pipe(
          switchMap(response => {
            // Sauvegarde les nouveaux tokens
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshToken', response.refreshToken);

            // Rejoue la requête avec le nouveau token
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${response.token}` }
            });
            return next(retryReq);
          }),
          catchError(refreshErr => {
            authService.logout();
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
