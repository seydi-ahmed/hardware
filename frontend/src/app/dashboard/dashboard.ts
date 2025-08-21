import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../services/store';
import { ProductService } from '../services/product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  stores: any[] = [];
  totalProducts: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.isLoading = true;
    this.storeService.getUserStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.calculateTotalProducts();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  calculateTotalProducts(): void {
    this.totalProducts = 0;
    if (this.stores.length === 0) return;

    // Pour chaque store, charger les produits et compter
    this.stores.forEach((store, index) => {
      this.productService.getStoreProducts(store.id).subscribe({
        next: (products) => {
          this.totalProducts += products.length;
        },
        error: (error) => {
          console.error(
            `Erreur lors du chargement des produits pour le store ${store.id}:`,
            error
          );
        },
      });
    });
  }

  getStoreCount(): number {
    return this.stores.length;
  }

  navigateToStore(storeId: number): void {
    this.router.navigate(['/stores', storeId, 'products']);
  }

  navigateToCreateStore(): void {
    this.router.navigate(['/stores/new']);
  }
}
