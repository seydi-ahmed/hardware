import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicService, PublicStore } from '../services/public';

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

  constructor(private publicService: PublicService) {}

  ngOnInit(): void {
    this.loadStores();
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
