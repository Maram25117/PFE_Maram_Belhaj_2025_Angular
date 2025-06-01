import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = ''; 
  password: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(
      private router: Router,
      private authService: AuthService
  ) {}

  handleLogin(event: Event): void {
    event.preventDefault();
    this.error = '';

  
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'L\'email et le mot de passe ne doivent pas être vides.';
      return;
    }
  
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
         this.error = 'Veuillez entrer une adresse email valide.';
         return;
     }


    this.isLoading = true;

    
    this.authService.loginWithCredentials(this.email, this.password).subscribe({
      next: (response) => {
        const adminId = response.id;
        console.log(`Connexion réussie pour Admin ID: ${adminId} (Email: ${this.email}). Redirection...`);
        this.router.navigate([`/admin-profile/${adminId}`]); 
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur pendant la connexion (LoginComponent):', error);
        this.error = error.message || 'Une erreur est survenue pendant la connexion.';
        this.isLoading = false;
      }
    });
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  navigateToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}