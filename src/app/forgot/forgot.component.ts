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

    this.authService.sendResetPasswordEmail(this.email).subscribe({
      next: (response: any) => { 
        console.log('Demande de réinitialisation réussie (API) pour :', this.email);
        this.isLoading = false;
        this.validationError = '';
        this.isApiSuccess = true;
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

        if (err.error) {

          if (typeof err.error === 'object' && err.error.message) {
            actualErrorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            try {
              const parsedError = JSON.parse(err.error);
              if (parsedError && parsedError.message) {
                actualErrorMessage = parsedError.message; 
              } else {
                 actualErrorMessage = err.error;
              }
            } catch (e) {
              console.warn("Could not parse err.error as JSON, using raw string:", err.error);
              actualErrorMessage = err.error;
            }
          }
        }

    
        if (err.status === 404) {
          this.apiFeedbackMessage = actualErrorMessage || 'Email indisponible.';
        } else {
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