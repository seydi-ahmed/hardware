import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  userData = {
    username: '',
    email: '',
    password: '',
  };
  errorMessage = '';
  constructor(private authService: AuthService, private router: Router) {}
  onSubmit(): void {
    this.authService.register(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = "Échec de l'inscription. Veuillez réessayer.";
        console.error('Register error', error);
      },
    });
  }
}
