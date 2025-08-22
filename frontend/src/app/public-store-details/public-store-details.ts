import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicService, PublicStore, PublicProduct } from '../services/public';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Correction: importer depuis '@angular/router'

@Component({
  selector: 'app-store-details',
  imports: [CommonModule],
  templateUrl: './public-store-details.html',
  styleUrls: ['./public-store-details.scss'],
})

// public-store-details.ts
export class PublicStoreDetailsComponent {
  store: PublicStore | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicService.getStoreById(+id).subscribe({
        next: (store) => {
          this.store = store;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        },
      });
    }
  }

  // Ajoutez cette méthode manquante
  viewStoreProducts(storeId: number) {
    this.router.navigate(['/public/stores', storeId, 'products']);
  }


  navigateBack() {
    this.router.navigate(['/public/stores']);
  }
}
