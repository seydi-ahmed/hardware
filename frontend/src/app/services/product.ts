import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getStoreProducts(storeId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/stores/${storeId}/products`).pipe(
      catchError((error) => {
        return throwError(
          () => new Error('Erreur lors du chargement des produits')
        );
      })
    );
  }

  getProductById(storeId: number, productId: number): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/api/stores/${storeId}/products/${productId}`)
      .pipe(
        catchError((error) => {
          return throwError(
            () => new Error('Erreur lors du chargement du produit')
          );
        })
      );
  }

  createProduct(
    storeId: number,
    productData: { name: string; price: number; stock: number }
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/api/stores/${storeId}/products`, productData)
      .pipe(
        catchError((error) => {
          return throwError(
            () =>
              new Error(error.error?.message || 'Erreur lors de la création')
          );
        })
      );
  }

  updateProduct(
    storeId: number,
    productId: number,
    productData: { name: string; price: number; stock: number }
  ): Observable<any> {
    return this.http
      .put(
        `${this.apiUrl}/api/stores/${storeId}/products/${productId}`,
        productData
      )
      .pipe(
        catchError((error) => {
          return throwError(
            () =>
              new Error(error.error?.message || 'Erreur lors de la mise à jour')
          );
        })
      );
  }

  deleteProduct(storeId: number, productId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/api/stores/${storeId}/products/${productId}`)
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Erreur lors de la suppression'));
        })
      );
  }
}
