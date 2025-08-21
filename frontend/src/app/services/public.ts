import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PublicStoreDto {
  id: number;
  name: string;
  address: string;
  ownerUsername: string;
}

export interface PublicProductDto {
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
  private baseUrl = `${environment.apiUrl}/api/public`;

  constructor(private http: HttpClient) {}

  // Get all public stores
  getStores(): Observable<PublicStoreDto[]> {
    return this.http.get<PublicStoreDto[]>(`${this.baseUrl}/stores`);
  }

  // Get all public products
  getProducts(): Observable<PublicProductDto[]> {
    return this.http.get<PublicProductDto[]>(`${this.baseUrl}/products`);
  }

  // Get products for a specific store
  getStoreProducts(storeId: number): Observable<PublicProductDto[]> {
    return this.http.get<PublicProductDto[]>(
      `${this.baseUrl}/stores/${storeId}/products`
    );
  }

  // Get store by ID (if this endpoint exists)
  getStore(storeId: number): Observable<PublicStoreDto> {
    return this.http.get<PublicStoreDto>(`${this.baseUrl}/stores/${storeId}`);
  }
}
