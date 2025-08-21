import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product';
import { StoreService } from '../services/store';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductFormComponent implements OnInit {
  storeId: number = 0;
  productId: number | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  store: any = null;

  productData = {
    name: '',
    price: 0,
    stock: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.storeId = +params['storeId'];
      this.productId = params['id'] ? +params['id'] : null;
      this.isEditMode = !!this.productId;

      this.loadStore();

      if (this.isEditMode) {
        this.loadProduct();
      }
    });
  }

  onPriceInput(): void {
    const value = Number(this.productData.price);
    this.productData.price = isNaN(value) ? 0 : Math.max(0, value);
  }

  onStockInput(): void {
    const value = Number(this.productData.stock);
    this.productData.stock = isNaN(value) ? 0 : Math.max(0, value);
  }

  loadStore(): void {
    this.storeService.getStoreById(this.storeId).subscribe({
      next: (store) => {
        this.store = store;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la quincaillerie:', error);
      },
    });
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.isLoading = true;
    this.productService.getProductById(this.storeId, this.productId).subscribe({
      next: (product) => {
        this.productData = {
          name: product.name,
          price: product.price,
          stock: product.stock,
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const request = this.isEditMode
      ? this.productService.updateProduct(
          this.storeId,
          this.productId!,
          this.productData
        )
      : this.productService.createProduct(this.storeId, this.productData);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/stores', this.storeId, 'products']);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/stores', this.storeId, 'products']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  }
}
