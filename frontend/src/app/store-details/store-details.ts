import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store';
import { ProductService } from '../services/product';

@Component({
  selector: 'app-store-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-details.html',
  styleUrl: './store-details.scss',
})
export class StoreDetailsComponent implements OnInit {
  storeId: number = 0;
  store: any = null;
  products: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.storeId = +params['id'];
      this.loadStore();
      this.loadProducts();
    });
  }

  loadStore(): void {
    this.isLoading = true;
    this.storeService.getStoreById(this.storeId).subscribe({
      next: (store) => {
        this.store = store;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  loadProducts(): void {
    this.productService.getStoreProducts(this.storeId).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
      },
    });
  }

  navigateToEdit(): void {
    this.router.navigate(['/stores', this.storeId, 'edit']);
  }

  navigateToStoresList(): void {
    this.router.navigate(['/stores']);
  }

  navigateToProductDetails(productId: number): void {
    this.router.navigate(['/stores', this.storeId, 'products', productId]);
  }

  navigateToCreateProduct(): void {
    this.router.navigate(['/stores', this.storeId, 'products', 'new']);
  }

  navigateToCreateGerant(): void {
    this.router.navigate(['/stores', this.store.id, 'gerant', 'new']);
  }


  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'rupture';
    if (stock < 10) return 'faible';
    return 'disponible';
  }
}
