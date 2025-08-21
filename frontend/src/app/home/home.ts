import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicService } from '../services/public';
@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'  // Ceci devrait charger le fichier SCSS
})
export class HomeComponent implements OnInit {
  stores: any[] = [];
  products: any[] = [];
  constructor(private publicService: PublicService) { }
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
}