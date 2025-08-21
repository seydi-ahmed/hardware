import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError, Observable } from 'rxjs';

export interface PublicStore {
  id: number;
  name: string;
  address: string;
  ownerUsername: string;
}

export interface PublicProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  storeName: string;
}

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getStores(): Observable<PublicStore[]> {
    return this.http
      .get<PublicStore[]>(`${this.apiUrl}/api/public/stores`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Erreur lors du chargement des quincailleries')
          );
        })
      );
  }

  getProducts(): Observable<PublicProduct[]> {
    return this.http
      .get<PublicProduct[]>(`${this.apiUrl}/api/public/products`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Erreur lors du chargement des produits')
          );
        })
      );
  }

  getStoreProducts(storeId: number): Observable<PublicProduct[]> {
    return this.http
      .get<PublicProduct[]>(
        `${this.apiUrl}/api/public/stores/${storeId}/products`
      )
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Erreur lors du chargement des produits')
          );
        })
      );
  }
}
