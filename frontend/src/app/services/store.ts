import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUserStores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/stores`).pipe(
      catchError(error => {
        return throwError(() => new Error('Erreur lors du chargement des quincailleries'));
      })
    );
  }

  getStoreById(storeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/stores/${storeId}`).pipe(
      catchError(error => {
        return throwError(() => new Error('Erreur lors du chargement de la quincaillerie'));
      })
    );
  }

  createStore(storeData: { name: string; address: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/stores`, storeData).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Erreur lors de la création'));
      })
    );
  }

  updateStore(storeId: number, storeData: { name: string; address: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/stores/${storeId}`, storeData).pipe(
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Erreur lors de la mise à jour'));
      })
    );
  }

  deleteStore(storeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/stores/${storeId}`).pipe(
      catchError(error => {
        return throwError(() => new Error('Erreur lors de la suppression'));
      })
    );
  }
}