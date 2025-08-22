import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicService, PublicProduct } from '../services/public';

@Component({
  selector: 'app-public-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-product-details.html',
  styleUrls: ['./public-product-details.scss']
})
export class PublicProductDetailsComponent implements OnInit {
  product: PublicProduct | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicService.getProductById(+id).subscribe({
        next: (product) => {
          this.product = product;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.isLoading = false;
        }
      });
    }
  }

  navigateBack() {
    this.router.navigate(['/public/products']);
  }
}