import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicService, PublicStore } from '../services/public';
import { Router } from '@angular/router'; // Correction: importer depuis '@angular/router'

@Component({
  selector: 'app-public-store-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-store-list.html',
  styleUrl: './public-store-list.scss',
})
export class PublicStoreListComponent implements OnInit {
  stores: PublicStore[] = [];
  isLoading: boolean = true;

  constructor(
    private publicService: PublicService,
    private router: Router // Ajouter l'injection du Router
  ) {}

  ngOnInit(): void {
    this.loadStores();
  }

  viewStoreDetails(storeId: number) {
    this.router.navigate(['/public/stores', storeId]);
  }

  loadStores(): void {
    this.publicService.getStores().subscribe({
      next: (data) => {
        this.stores = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading stores', error);
        this.isLoading = false;
      },
    });
  }
}