/*import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  handleLogin(event: Event): void {
    event.preventDefault();
    this.error = '';
    
  
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Les champs ne doivent pas être vides.';
      return;
    }

    this.isLoading = true;

    fetch('http://localhost:8089/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.username, password: this.password }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401 || response.status === 403) {
        throw new Error('Nom d\'utilisateur ou mot de passe incorrect.');
      } else {
        return response.json().then(errorData => {
          throw new Error(errorData.message || `Échec de la connexion (Status: ${response.status})`);
        }).catch(() => {
          throw new Error(`Échec de la connexion (Status: ${response.status})`);
        });
      }
    })
    .then(data => { 
      const adminId = data.id; 

      if (adminId === null || adminId === undefined) {
         console.error("Réponse du login réussie mais ID admin manquant:", data);
         throw new Error("ID Admin non reçu du serveur après la connexion.");
      }

      this.authService.login(adminId);

      console.log(`Connexion réussie pour Admin ID: ${adminId}. Redirection...`);

     
      this.router.navigate([`/admin-profile/${adminId}`]);

    })
    .catch(error => {
      console.error('Erreur pendant la connexion:', error);
      this.error = error.message || 'Une erreur est survenue pendant la connexion.';
    })
    .finally(() => {
      this.isLoading = false;
    });
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  navigateToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}*/

/*import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';
  isLoading: boolean = false;
  private apiUrl: string = 'http://localhost:8089/admin/login';

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

 /* handleLogin(event: Event): void {
    event.preventDefault();
    this.error = '';

    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Les champs ne doivent pas être vides.';
      return;
    }

    this.isLoading = true;

    this.http.post<{ id: number }>(this.apiUrl, { username: this.username, password: this.password }, { withCredentials: true })
      .subscribe({
        next: (data) => {
          const adminId = data.id;
          if (!adminId) {
            throw new Error("ID Admin non reçu du serveur après la connexion.");
          }

          this.authService.login(adminId);
          console.log(`Connexion réussie pour Admin ID: ${adminId}. Redirection...`);
          this.router.navigate([`/admin-profile/${adminId}`]);
        },
        error: (error) => {
          console.error('Erreur pendant la connexion:', error);
          this.error = error.error?.message || 'Une erreur est survenue pendant la connexion.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }*/

      /*hedhiiii shihaaaa*/
      /*handleLogin(event: Event): void {
        event.preventDefault();
        this.error = '';
      
        if (!this.username.trim() || !this.password.trim()) {
          this.error = 'Les champs ne doivent pas être vides.';
          return;
        }
      
        this.isLoading = true;
      
        this.authService.loginWithCredentials(this.username, this.password).subscribe({
          next: (response) => {
            const adminId = response.id;
            if (!adminId) {
              throw new Error("ID Admin non reçu du serveur après la connexion.");
            }
      
            this.authService.login(adminId); // Stocke dans localStorage
            console.log(`Connexion réussie pour Admin ID: ${adminId}. Redirection...`);
            this.router.navigate([`/admin-profile/${adminId}`]);
          },
          error: (error) => {
            console.error('Erreur pendant la connexion:', error);
            this.error = error.error?.message || 'Une erreur est survenue pendant la connexion.';
          },
          complete: () => {
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
}*/





import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = ''; // RENOMMER username en email
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

    // Valider email et password
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'L\'email et le mot de passe ne doivent pas être vides.';
      return;
    }
     // Validation de format email simple (une validation plus robuste peut être ajoutée)
     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
         this.error = 'Veuillez entrer une adresse email valide.';
         return;
     }


    this.isLoading = true;

    // Appeler le service avec l'email
    this.authService.loginWithCredentials(this.email, this.password).subscribe({
      next: (response) => {
        const adminId = response.id;
        console.log(`Connexion réussie pour Admin ID: ${adminId} (Email: ${this.email}). Redirection...`);
        this.router.navigate([`/admin-profile/${adminId}`]); // Ou la route appropriée
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