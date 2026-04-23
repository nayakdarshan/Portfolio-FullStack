import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

const TOKEN_KEY = 'portfolio_admin_token';
const REFRESH_KEY = 'portfolio_admin_refresh';
const USER_KEY = 'portfolio_admin_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly currentUser = signal<AdminUser | null>(this.loadUser());
  readonly isAuthenticated = signal<boolean>(!!this.getToken());

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res.success) {
            localStorage.setItem(TOKEN_KEY, res.data.token);
            localStorage.setItem(REFRESH_KEY, res.data.refreshToken);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data.admin));
            this.currentUser.set(res.data.admin);
            this.isAuthenticated.set(true);
          }
        }),
        catchError((err) => throwError(() => err))
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  refreshToken() {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) return throwError(() => new Error('No refresh token'));

    return this.http
      .post<any>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          if (res.success) {
            localStorage.setItem(TOKEN_KEY, res.data.token);
          }
        })
      );
  }

  private loadUser(): AdminUser | null {
    const raw = localStorage.getItem(USER_KEY);
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
}
