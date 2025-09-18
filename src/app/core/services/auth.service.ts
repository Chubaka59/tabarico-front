import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = "/api";
  private role: string | null = null;

  constructor(private http: HttpClient) {
    this.role = localStorage.getItem('role');
  }

  login(username: string, password: string) {
    return this.http.post<{ token: string, refreshToken: string, role: string }>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          this.setRole(response.role)
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          localStorage.setItem('role', response.role)
        })
      );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  logout() {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    return this.http.post<{ token: string, refreshToken: string }>(
      `${this.apiUrl}/auth/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
  }

  getUserInfo(): { username: string; firstName?: string; lastName?: string } | null {
    const decoded = this.decodeToken();
    if (!decoded) return null;
    return {
      username: decoded.username,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };
  }

  setRole(role: string) {
    this.role = role;
  }

  isResponsable(): boolean {
    return this.role === 'Responsable';
  }

  isCDI(): boolean {
    return this.role === 'CDI';
  }

  isPatron(): boolean {
    return this.role === 'Patron';
  }

}
