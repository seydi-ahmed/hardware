import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PublicService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  getStores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/public/stores`);
  }
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/public/products`);
  }
  getStoreProducts(storeId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/public/stores/${storeId}/products`
    );
  }
}
