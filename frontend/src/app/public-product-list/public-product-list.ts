import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicService, PublicProduct } from '../services/public';
import { Router } from '@angular/router'; // Import du Router
@Component({
  selector: 'app-public-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-product-list.html',
  styleUrl: './public-product-list.scss',
})
export class PublicProductListComponent implements OnInit {
  products: PublicProduct[] = [];
  isLoading: boolean = true;
  // Injection du Router
  constructor(
    private publicService: PublicService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadProducts();
  }
  loadProducts(): void {
    this.publicService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products', error);
        this.isLoading = false;
      },
    });
  }
  // Méthode pour naviguer vers les détails d'un produit
  viewProductDetails(productId: number) {
    this.router.navigate(['/public/products', productId]);
  }
}