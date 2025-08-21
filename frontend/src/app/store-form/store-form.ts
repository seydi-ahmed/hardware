import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-form.html',
  styleUrl: './store-form.scss'
})
export class StoreFormComponent {
  // Logique du composant
}