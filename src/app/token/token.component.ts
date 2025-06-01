import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  token: string = ''; 
  newPassword: string = ''; 
  confirmPassword: string = ''; 
  error: string = ''; 
  success: string = ''; 

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {}

  handleResetPasswordSubmit(event: Event): void {
    event.preventDefault();
    this.error = '';
    this.success = '';

    if (!this.token || !this.newPassword || !this.confirmPassword) {
      this.error = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.success = 'Mot de passe réinitialisé avec succès.';
        console.log(this.success);

        // Redirection après 3 secondes pour laisser le message visible
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de la réinitialisation du mot de passe:', err);
        this.error = `Une erreur est survenue: ${err.message || err.statusText}. Code d'erreur: ${err.status}.`;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

}


