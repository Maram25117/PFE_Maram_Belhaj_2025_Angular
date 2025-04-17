/*import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

 // Propriétés
 token: string = ''; // Token reçu par email
 newPassword: string = ''; // Nouveau mot de passe
 confirmPassword: string = ''; // Confirmation du nouveau mot de passe
 error: string = ''; // Message d'erreur

 constructor() { }

 ngOnInit(): void {
 }

 // Méthode appelée lors de la soumission du formulaire
 handleResetPasswordSubmit(event: Event): void {
   event.preventDefault(); // Empêche le rechargement de la page

   // Vérifie si les mots de passe sont identiques
   if (this.newPassword !== this.confirmPassword) {
     this.error = 'Les mots de passe ne correspondent pas.';
     return;
   }

   // Vous pouvez ajouter ici la logique pour réinitialiser le mot de passe avec le token
   if (this.token && this.newPassword) {
     console.log('Réinitialisation du mot de passe avec le token:', this.token);
     // Si tout est validé, vous pouvez envoyer la demande de réinitialisation.
   } else {
     this.error = 'Veuillez entrer tous les champs.';
   }
 }

}*/
/*import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  token: string = ''; // Token reçu par email
  newPassword: string = ''; // Nouveau mot de passe
  confirmPassword: string = ''; // Confirmation du nouveau mot de passe
  error: string = ''; // Message d'erreur

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {}

    handleResetPasswordSubmit(event: Event): void {
      event.preventDefault();
    
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Les mots de passe ne correspondent pas.';
        return;
      }
    
      if (this.token && this.newPassword) {
        this.authService.resetPassword(this.token, this.newPassword).subscribe({
          next: () => {
            console.log('Mot de passe réinitialisé avec succès.');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Erreur lors de la réinitialisation du mot de passe:', err);
            this.error = `Une erreur est survenue: ${err.message || err.statusText}. Code d'erreur: ${err.status}.`;
          }          
        });
      } else {
        this.error = 'Veuillez entrer tous les champs.';
      }
    }
    
}*/
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css']
})
export class TokenComponent implements OnInit {

  token: string = ''; // Token reçu par email
  newPassword: string = ''; // Nouveau mot de passe
  confirmPassword: string = ''; // Confirmation du nouveau mot de passe
  error: string = ''; // Message d'erreur
  success: string = ''; // Message de succès

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

        // Redirection après 2 secondes pour laisser le message visible
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


