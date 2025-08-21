import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  credentials = {
    username: '',
    password: '',
  };
  errorMessage = '';
  constructor(private authService: AuthService, private router: Router) {}
  onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.errorMessage = 'Échec de la connexion. Vérifiez vos identifiants.';
        console.error('Login error', error);
      },
    });
  }
}
