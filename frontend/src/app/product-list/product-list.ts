import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product';
import { StoreService } from '../services/store';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit {
  storeId: number = 0;
  store: any = null;
  products: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.storeId = +params['storeId'];
      this.loadStoreData();
      this.loadProducts();
    });
  }

  loadStoreData(): void {
    this.storeService.getStoreById(this.storeId).subscribe({
      next: (store) => {
        this.store = store;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la quincaillerie:', error);
      },
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getStoreProducts(this.storeId).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  deleteProduct(productId: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(this.storeId, productId).subscribe({
        next: () => {
          this.products = this.products.filter(
            (product) => product.id !== productId
          );
        },
        error: (error) => {
          alert('Erreur lors de la suppression: ' + error.message);
        },
      });
    }
  }

  navigateToCreateProduct(): void {
    this.router.navigate(['/stores', this.storeId, 'products', 'new']);
  }

  navigateToProductDetails(productId: number): void {
    this.router.navigate(['/stores', this.storeId, 'products', productId]);
  }

  navigateToEditProduct(productId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([
      '/stores',
      this.storeId,
      'products',
      productId,
      'edit',
    ]);
  }

  navigateToStoreList(): void {
    this.router.navigate(['/stores']);
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
