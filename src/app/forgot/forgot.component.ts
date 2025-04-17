/*import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  // Propriétés
  email: string = '';  // Propriété email
  error: string = '';  // Propriété error, initialisée comme vide

  constructor() { }

  ngOnInit(): void {
  }

  // Méthode appelée lors de l'envoi du formulaire
  handleResetPassword(event: Event): void {
    event.preventDefault(); // Empêche le rechargement de la page
    // Vous pouvez ajouter ici votre logique pour réinitialiser le mot de passe
    if (this.email) {
      // Si l'email est valide, vous pouvez effectuer l'action (par exemple, appeler un service pour réinitialiser le mot de passe)
      console.log('Réinitialisation du mot de passe pour :', this.email);
      //this.router.navigate(['/reset-password']);
      // Vous pouvez réinitialiser le champ ou afficher un message de confirmation.
    } else {
      this.error = 'Veuillez entrer un email valide.';
    }
  }

}*/
/*import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  email: string = ''; // Email de l'utilisateur
  error: string = ''; // Erreur éventuelle

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {}

 
    handleResetPassword(event: Event): void {
      event.preventDefault();
    
      if (this.email) {
        // Appel à l'API backend pour envoyer l'email
        this.authService.sendResetPasswordEmail(this.email).subscribe({
          next: (response: string) => { // Attendez une chaîne de caractères ici
            console.log('Email envoyé pour réinitialiser le mot de passe :', response);
            this.router.navigate(['/token']);
          },
          error: (err) => {
            console.error('Erreur lors de l\'envoi de l\'email:', err);
            this.error = 'Une erreur est survenue lors de l\'envoi de l\'email.';
          }
        });
      } else {
        this.error = 'Veuillez entrer un email valide.';
      }
    }
    
}*/


/*import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  email: string = ''; // Email de l'utilisateur
  error: string = ''; // Message d'erreur

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {}

  handleResetPassword(event: Event): void {
    event.preventDefault();
    this.error = '';

    // Vérification des champs vides
    if (!this.email.trim()) {
      this.error = 'Le champ email ne doit pas être vide.';
      return;
    }

    // Vérification du format de l'email
    if (!this.email.includes('@')) {
      this.error = 'Veuillez entrer un email valide.';
      return;
    }

    // Appel à l'API backend pour envoyer l'email
    this.authService.sendResetPasswordEmail(this.email).subscribe({
      next: (response: string) => { 
        console.log('Email envoyé pour réinitialiser le mot de passe :', response);
        this.router.navigate(['/token']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi de l\'email:', err);
        this.error = 'Une erreur est survenue lors de l\'envoi de l\'email.';
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
})
export class ForgotComponent implements OnInit, OnDestroy {

  email: string = '';
  validationError: string = '';
  apiFeedbackMessage: string = '';
  isApiSuccess: boolean = false;
  isLoading: boolean = false;

  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private navigationTimerSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.cancelNavigationTimer();
  }

  handleResetPassword(event: Event): void {
    event.preventDefault();
    this.validationError = '';
    this.apiFeedbackMessage = '';
    this.isApiSuccess = false;
    this.isLoading = true;
    this.cancelNavigationTimer();

    // --- Validations Client ---
    if (!this.email.trim()) {
      this.validationError = 'Le champ email ne doit pas être vide.';
      this.isLoading = false;
      return;
    }
    if (!this.emailRegex.test(this.email)) {
      this.validationError = 'Format d\'email invalide.';
      this.isLoading = false;
      return;
    }

    // --- Appel Backend ---
    this.authService.sendResetPasswordEmail(this.email).subscribe({
      next: (response: any) => { // Le type de réponse succès peut varier
        console.log('Demande de réinitialisation réussie (API) pour :', this.email);
        this.isLoading = false;
        this.validationError = '';
        this.isApiSuccess = true;
        // Le message de succès est défini côté frontend
        this.apiFeedbackMessage = 'Vérifiez votre boîte de réception.';
        this.navigationTimerSubscription = timer(3000).subscribe(() => {
          this.router.navigate(['/token']);
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors de la demande de réinitialisation (API) :', err);
        this.isLoading = false;
        this.isApiSuccess = false;
        this.validationError = '';

        let actualErrorMessage: string | null = null;

        // --- Tenter d'extraire le message de err.error ---
        if (err.error) {
          // CAS 1: err.error est déjà un objet (le backend a envoyé Content-Type: application/json)
          if (typeof err.error === 'object' && err.error.message) {
            actualErrorMessage = err.error.message;
          // CAS 2: err.error est une chaîne (probablement JSON non parsé)
          } else if (typeof err.error === 'string') {
            try {
              // Essayer de parser la chaîne JSON
              const parsedError = JSON.parse(err.error);
              if (parsedError && parsedError.message) {
                actualErrorMessage = parsedError.message; // Prend le message du JSON parsé
              } else {
                 // Si le parsing réussit mais n'a pas de .message, utiliser la chaîne telle quelle
                 actualErrorMessage = err.error;
              }
            } catch (e) {
              // Si le parsing échoue, la chaîne n'était pas du JSON valide, l'utiliser telle quelle
              console.warn("Could not parse err.error as JSON, using raw string:", err.error);
              actualErrorMessage = err.error;
            }
          }
        }

        // --- Définir le message final basé sur le statut et le message extrait ---
        if (err.status === 404) {
          // Utilise le message extrait si disponible, sinon fallback
          this.apiFeedbackMessage = actualErrorMessage || 'Email indisponible.';
        } else {
          // Pour les autres erreurs, utilise le message extrait, ou le message d'erreur HTTP, ou un générique
          this.apiFeedbackMessage = actualErrorMessage || err.message || 'Une erreur serveur est survenue.';
        }
      }
    });
  }

  navigateToLogin(): void {
    this.cancelNavigationTimer();
    this.router.navigate(['/login']);
  }

  private cancelNavigationTimer(): void {
    if (this.navigationTimerSubscription) {
      this.navigationTimerSubscription.unsubscribe();
      this.navigationTimerSubscription = null;
      console.log('Timer de navigation annulé.');
    }
  }
}