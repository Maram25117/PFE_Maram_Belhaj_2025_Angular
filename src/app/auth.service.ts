import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError, catchError, map } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

interface LoginResponse {
  id: number; 
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'adminId';
  private loggedIn = new BehaviorSubject<boolean>(this.checkInitialLoginStatus());
  isLoggedIn$ = this.loggedIn.asObservable();
  private apiUrl: string = 'http://localhost:8089/admin'; 

  constructor(private router: Router, private http: HttpClient) {
  }

  private checkInitialLoginStatus(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  private storeLoginState(adminId: string | number): void {
     if (adminId === null || adminId === undefined) {
        console.error("AuthService: Tentative de stockage avec un ID invalide.");
        return;
     }
     localStorage.setItem(this.storageKey, adminId.toString());
     this.loggedIn.next(true);
     console.log(`AuthService: Admin ID ${adminId} stocké. Statut loggedIn mis à true.`);
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { responseType: 'text', withCredentials: true }).subscribe({
        next: () => console.log("AuthService: Logout côté serveur réussi."),
        error: (err) => console.error("AuthService: Erreur lors du logout côté serveur.", err)
    });
    localStorage.removeItem(this.storageKey);
    this.loggedIn.next(false);
    console.log(`AuthService: Admin déconnecté. Statut loggedIn mis à false.`);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  getAdminId(): string | null {
    return localStorage.getItem(this.storageKey);
  }

 
  loginWithCredentials(email: string, password: string): Observable<LoginResponse> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    
    const body = { email, password };

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      body,
      { headers: headers, withCredentials: true }
    ).pipe(
      tap(response => {
        if (response && response.id != null) { 
           console.log('AuthService: Connexion backend réussie via email.');
           this.storeLoginState(response.id);
        } else {
           console.error("AuthService: Réponse de login invalide (pas d'ID ou réponse nulle).", response);
        }
      }),
      
      catchError((error: HttpErrorResponse) => {
          console.error('AuthService: Erreur pendant la requête de login', error);
          let errorMessage = 'Échec de la connexion. Vérifiez votre email et mot de passe.';
          if (error.status === 0) {
              errorMessage = 'Impossible de contacter le serveur.';
          } else if (error.status === 401) { 
               errorMessage = 'Email ou mot de passe incorrect.';
          } else if (error.error?.message) { 
              errorMessage = error.error.message;
          }
          return throwError(() => new Error(errorMessage));
      })
    );
  }

      sendResetPasswordEmail(email: string): Observable<any> { 
        return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {}, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            responseType: 'json', 
            observe: 'response', 
            withCredentials: true
        }).pipe(
           catchError(this.handleError) 
        );
    }

   resetPassword(token: string, newPassword: string): Observable<string> {
     const data = { token, newPassword };
     return this.http.post(`${this.apiUrl}/reset-password`, data, {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
       responseType: 'text',
       withCredentials: true
     }).pipe(
         catchError(this.handleError) 
     );
   }

   
   verifySessionOnLoad(): Observable<boolean> {
     const adminId = this.getAdminId();
     if (!adminId) {
         this.loggedIn.next(false);
         return new BehaviorSubject<boolean>(false).asObservable();
     }

    
     return this.http.get<any>(`${this.apiUrl}/profile/${adminId}`, { withCredentials: true })
       .pipe(
         map(() => true), 
         tap((isValid) => {
           if (isValid) {
               this.loggedIn.next(true);
               console.log("AuthService: Session vérifiée avec succès au chargement.");
           }
         }),
         catchError((error: HttpErrorResponse) => {
           console.warn("AuthService: Vérification de session échouée (probablement 401/403). Déconnexion locale.", error.status);
           localStorage.removeItem(this.storageKey);
           this.loggedIn.next(false);
           return new BehaviorSubject<boolean>(false).asObservable();
         })
       );
   }
        private handleError(error: HttpErrorResponse) {
          console.error('AuthService: Erreur HTTP interceptée dans handleError:', error);
          let displayMessage = 'Une erreur inconnue est survenue.';
          if (error.status === 0 || error.error instanceof ProgressEvent) {
               displayMessage = 'Erreur de connexion ou serveur inaccessible.';
          } else if (error.status === 404) {
               displayMessage = error.error?.message || 'Ressource non trouvée (404).';
          } else if (error.error?.message) {
               displayMessage = error.error.message;
          } else if (typeof error.error === 'string' && error.error.trim() !== '') {
               displayMessage = error.error;
          } else {
               
               displayMessage = error.message || `Erreur HTTP ${error.status}`;
          }
          console.log("AuthService: Message d'erreur extrait pour affichage potentiel:", displayMessage);
          return throwError(() => error); 
      }
  
     
getAdminName(): Observable<string> {
  const adminId = this.getAdminId();
  if (!adminId) {
    return throwError(() => new Error('Utilisateur non connecté'));
  }
  return this.http.get<{ username: string }>(`${this.apiUrl}/profile/${adminId}`, { withCredentials: true })
    .pipe(
      map(response => response.username),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération du nom de l\'utilisateur:', error);
        return throwError(() => new Error('Erreur de récupération du nom.'));
      })
    );
}


}