import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PublicService, PublicStore, PublicProduct } from '../services/public';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  stores: PublicStore[] = [];
  products: PublicProduct[] = [];

  constructor(
    private publicService: PublicService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStores();
    this.loadProducts();
  }

  loadStores(): void {
    this.publicService.getStores().subscribe({
      next: (data) => this.stores = data,
      error: (error) => console.error('Error loading stores', error)
    });
  }

  loadProducts(): void {
    this.publicService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (error) => console.error('Error loading products', error)
    });
  }

  navigateToStores(): void {
    this.router.navigate(['/public/stores']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/public/products']);
  }
}