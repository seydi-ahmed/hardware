import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product';
import { StoreService } from '../services/store';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetailsComponent implements OnInit {
  storeId: number = 0;
  productId: number = 0;
  product: any = null;
  store: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = +params['storeId'];
      this.productId = +params['id'];
      this.loadProduct();
      this.loadStore();
    });
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getProductById(this.storeId, this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  loadStore(): void {
    this.storeService.getStoreById(this.storeId).subscribe({
      next: (store) => {
        this.store = store;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la quincaillerie:', error);
      }
    });
  }

  navigateToEdit(): void {
    this.router.navigate(['/stores', this.storeId, 'products', this.productId, 'edit']);
  }

  navigateToProductList(): void {
    this.router.navigate(['/stores', this.storeId, 'products']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'rupture';
    if (stock < 10) return 'faible';
    return 'disponible';
  }
}