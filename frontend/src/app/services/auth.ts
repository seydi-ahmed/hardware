import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;
  private tokenSubject = new BehaviorSubject<string | null>(null);
  constructor() {
    // Récupérer le token du localStorage seulement si on est dans le navigateur
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.tokenSubject.next(token);
      }
    }
  }
  register(userData: { username: string; email: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }
  login(credentials: { username: string; password: string }) {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }
  logout() {
    this.setToken(null);
  }
  setToken(token: string | null) {
    if (isPlatformBrowser(this.platformId)) {
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
