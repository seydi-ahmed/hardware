import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicService, PublicProduct } from '../services/public';

@Component({
  selector: 'app-public-store-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-store-products.html',
  styleUrls: ['./public-store-products.scss'],
})
export class PublicStoreProductsComponent implements OnInit {
  products: PublicProduct[] = [];
  isLoading = true;
  storeId: number | null = null;
  storeName: string = '';

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit() {
    this.storeId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.storeId) {
      this.loadStoreProducts(this.storeId);
    }
  }

  loadStoreProducts(storeId: number) {
    this.publicService.getStoreProducts(storeId).subscribe({
      next: (products) => {
        this.products = products;
        if (products.length > 0) {
          this.storeName = products[0].storeName;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      },
    });
  }

  navigateBack() {
    this.router.navigate(['/public/stores', this.storeId]);
  }

  viewProductDetails(productId: number) {
    this.router.navigate(['/public/products', productId]);
  }
}
