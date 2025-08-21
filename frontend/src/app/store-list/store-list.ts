import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../services/store';
import { ProductService } from '../services/product';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './store-list.html',
  styleUrl: './store-list.scss',
})
export class StoreListComponent implements OnInit {
  stores: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  productCounts: { [storeId: number]: number } = {};

  constructor(
    private storeService: StoreService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.isLoading = true;
    this.storeService.getUserStores().subscribe({
      next: (stores) => {
        this.stores = stores;
        this.loadProductCounts();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  loadProductCounts(): void {
    this.stores.forEach((store) => {
      this.productService.getStoreProducts(store.id).subscribe({
        next: (products) => {
          this.productCounts[store.id] = products.length;
        },
        error: (error) => {
          console.error(
            `Erreur lors du chargement des produits pour ${store.name}:`,
            error
          );
          this.productCounts[store.id] = 0;
        },
      });
    });
  }

  navigateToStoreDetails(storeId: number): void {
    this.router.navigate(['/stores', storeId]);
  }

  deleteStore(storeId: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer cette quincaillerie ?')) {
      this.storeService.deleteStore(storeId).subscribe({
        next: () => {
          this.stores = this.stores.filter((store) => store.id !== storeId);
          delete this.productCounts[storeId];
        },
        error: (error) => {
          alert('Erreur lors de la suppression: ' + error.message);
        },
      });
    }
  }

  navigateToStoreProducts(storeId: number): void {
    this.router.navigate(['/stores', storeId, 'products']);
  }

  navigateToEditStore(storeId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/stores', storeId, 'edit']);
  }

  getProductCount(storeId: number): number {
    return this.productCounts[storeId] || 0;
  }
}
