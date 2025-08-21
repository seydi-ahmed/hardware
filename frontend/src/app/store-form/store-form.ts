import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../services/store';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-form.html',
  styleUrl: './store-form.scss'
})
export class StoreFormComponent implements OnInit {
  storeId: number | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  storeData = {
    name: '',
    address: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = params['id'] ? +params['id'] : null;
      this.isEditMode = !!this.storeId;

      if (this.isEditMode) {
        this.loadStore();
      }
    });
  }

  loadStore(): void {
    if (!this.storeId) return;

    this.isLoading = true;
    this.storeService.getStoreById(this.storeId).subscribe({
      next: (store) => {
        this.storeData = {
          name: store.name,
          address: store.address
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const request = this.isEditMode
      ? this.storeService.updateStore(this.storeId!, this.storeData)
      : this.storeService.createStore(this.storeData);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/stores']);
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/stores']);
  }
}