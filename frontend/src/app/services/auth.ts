import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {
    if (this.isBrowser()) {
      const token = localStorage.getItem('token');
      if (token) {
        this.tokenSubject.next(token);
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  register(userData: { username: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      }),
      catchError((error) => {
        return throwError(
          () =>
            new Error(error.error?.message || "Erreur lors de l'inscription")
        );
      })
    );
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      }),
      catchError((error) => {
        return throwError(
          () => new Error(error.error?.message || 'Erreur lors de la connexion')
        );
      })
    );
  }

  logout() {
    this.setToken(null);
  }

  setToken(token: string | null) {
    if (this.isBrowser()) {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
