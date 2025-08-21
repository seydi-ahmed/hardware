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
  styleUrl: './register.scss',
})
export class RegisterComponent {
  userData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  errorMessage = '';
  isLoading = false;
  passwordsMatch = true;

  constructor(private authService: AuthService, private router: Router) {}

  checkPasswords(): void {
    this.passwordsMatch =
      this.userData.password === this.userData.confirmPassword;
  }

  onSubmit() {
    this.checkPasswords();

    if (!this.passwordsMatch) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { confirmPassword, ...registrationData } = this.userData;

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message;
      },
    });
  }
}
