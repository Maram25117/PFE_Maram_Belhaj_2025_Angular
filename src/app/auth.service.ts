/*import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs'; // Importer tap
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'adminId';
  private loggedIn = new BehaviorSubject<boolean>(this.checkInitialLoginStatus());
  isLoggedIn$ = this.loggedIn.asObservable();

  // ---- AJOUT : Stockage temporaire en mémoire ----
  private currentUsername: string | null = null;
  private currentPassword: string | null = null; // Stockage temporaire du mot de passe
  // ---- FIN AJOUT ----

  private apiUrl: string = 'http://localhost:8089/admin';

  constructor(private router: Router, private http: HttpClient) {}

  private checkInitialLoginStatus(): boolean {
    return !!localStorage.getItem(this.storageKey);
    // Possible amélioration: Si l'ID est là, mais pas les credentials en mémoire, considérer comme déconnecté ?
  }

  login(adminId: string | number): void {
     // Cette méthode est maintenant juste pour le stockage de l'ID et l'état loggedIn
     if (adminId === null || adminId === undefined) {
        console.error("AuthService: Tentative de login (stockage ID) avec un ID invalide.");
        return;
     }
     localStorage.setItem(this.storageKey, adminId.toString());
     this.loggedIn.next(true);
     console.log(`AuthService: Admin ID ${adminId} stocké.`);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    // ---- AJOUT : Effacer les identifiants en mémoire ----
    this.currentUsername = null;
    this.currentPassword = null;
    // ---- FIN AJOUT ----
    this.loggedIn.next(false);
    console.log(`AuthService: Clé '${this.storageKey}' et identifiants en mémoire supprimés.`);
    this.router.navigate(['/login']);
  }


  isLoggedIn(): boolean {
    // Peut-être vérifier aussi la présence des credentials en mémoire si nécessaire
    return !!localStorage.getItem(this.storageKey) && !!this.currentUsername && !!this.currentPassword;
  }

  getAdminId(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  // ---- AJOUT : Getters pour l'intercepteur ----
  getCurrentUsername(): string | null {
    return this.currentUsername;
  }

  getCurrentPassword(): string | null {
    return this.currentPassword;
  }




  loginWithCredentials(username: string, password: string): Observable<{ id: number }> {
    
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json' // Si votre endpoint attend un corps, sinon inutile
    });

  
    return this.http.post<{ id: number }>(
      `${this.apiUrl}/login`,
      { username, password } // Envoyer dans le corps
      // PAS d'en-tête Authorization ici
    ).pipe(
      tap(response => {
        // Stocker les identifiants UNIQUEMENT si la connexion réussit
        if (response && response.id) {
          this.currentUsername = username;
          this.currentPassword = password; // Stockage temporaire
          console.log('AuthService: Identifiants stockés en mémoire après login réussi.');
          this.login(response.id); // Appelle la méthode qui met à jour localStorage et BehaviorSubject
        } else {
           // Gérer le cas où la réponse ne contient pas l'ID attendu
           console.error("AuthService: Réponse de login invalide reçue.", response);
           throw new Error("Réponse de login invalide.");
        }
      })
    );
  }

      sendResetPasswordEmail(email: string): Observable<string> {
        return this.http.post<string>(`${this.apiUrl}/forgot-password?email=${email}`, {}, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          responseType: 'text' as 'json'  // Spécifie que la réponse est du texte et non du JSON
        });
      }

      // AuthService (ajout dans la classe existante)

      
    
    resetPassword(token: string, newPassword: string): Observable<string> {
      const data = { token, newPassword };
      return this.http.post<string>(`${this.apiUrl}/reset-password`, data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'text' as 'json'  // Changez 'json' en 'text' pour indiquer que vous attendez du texte brut
      });
    }
    
    
}*/



import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, throwError, catchError, map } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

interface LoginResponse {
  id: number; // Ou string si votre ID est une chaîne
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'adminId';
  private loggedIn = new BehaviorSubject<boolean>(this.checkInitialLoginStatus());
  isLoggedIn$ = this.loggedIn.asObservable();
  private apiUrl: string = 'http://localhost:8089/admin'; // Votre URL backend

  constructor(private router: Router, private http: HttpClient) {
     // Considérez l'implémentation de verifySessionOnLoad
     // this.verifySessionOnLoad().subscribe(); // Appel optionnel au démarrage
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

  // MODIFICATION ICI: Accepter 'email' au lieu de 'username'
  loginWithCredentials(email: string, password: string): Observable<LoginResponse> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // MODIFICATION ICI: Envoyer 'email' dans le corps de la requête
    const body = { email, password };

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      body, // Envoyer le corps avec email/password
      { headers: headers, withCredentials: true }
    ).pipe(
      tap(response => {
        if (response && response.id != null) { // Vérifier que l'ID n'est pas null/undefined
           console.log('AuthService: Connexion backend réussie via email.');
           this.storeLoginState(response.id);
        } else {
           console.error("AuthService: Réponse de login invalide (pas d'ID ou réponse nulle).", response);
           // Ne pas lancer l'erreur ici directement, laisser catchError le faire.
           // throw new Error("Réponse de login invalide."); <== Mauvaise pratique dans tap
        }
      }),
      // IMPORTANT: Si la réponse est invalide (pas d'ID), tap ne lèvera pas d'erreur qui arrête le flux.
      // catchError gérera les erreurs HTTP (401, 500 etc.) ou réseau.
      // Si vous voulez forcer une erreur en cas de réponse valide (200 OK) mais sans ID,
      // vous pourriez ajouter un `map` ou un `filter` avant le `tap` pour vérifier response.id
      // et lancer une erreur si nécessaire, qui serait ensuite capturée par `catchError`.
      // Exemple (plus robuste):
      // map(response => {
      //   if (!response || response.id == null) {
      //      console.error("AuthService: Réponse de login invalide (pas d'ID).");
      //      throw new Error("Réponse de login invalide reçue du serveur.");
      //   }
      //   return response; // Renvoyer la réponse valide
      // }),
      // tap(validResponse => { ... }), // tap ne s'exécutera que si map réussit
      catchError((error: HttpErrorResponse) => {
          console.error('AuthService: Erreur pendant la requête de login', error);
          let errorMessage = 'Échec de la connexion. Vérifiez votre email et mot de passe.';
          if (error.status === 0) {
              errorMessage = 'Impossible de contacter le serveur.';
          } else if (error.status === 401) { // Spécifiquement pour Unauthorized
               errorMessage = 'Email ou mot de passe incorrect.';
          } else if (error.error?.message) { // Message d'erreur du backend si disponible
              errorMessage = error.error.message;
          }
           // Renvoyer une nouvelle Erreur pour que le composant puisse l'afficher
          return throwError(() => new Error(errorMessage));
      })
    );
  }

  // --- Méthodes Reset Password (inchangées conceptuellement, mais assurez-vous qu'elles fonctionnent avec l'email) ---
  /*sendResetPasswordEmail(email: string): Observable<string> {
      // L'endpoint backend /forgot-password doit bien sûr utiliser l'email
      return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {}, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          responseType: 'text',
          withCredentials: true
      }).pipe(
         catchError(this.handleError) 
      );
  }*/
      sendResetPasswordEmail(email: string): Observable<any> { // Le type Observable<any> est souvent suffisant ici
        // L'endpoint backend /forgot-password doit bien sûr utiliser l'email
        return this.http.post(`${this.apiUrl}/forgot-password?email=${email}`, {}, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
             // IMPORTANT : Précisez 'json' si vous attendez une réponse JSON en cas de succès.
             // Si le succès ne renvoie rien ou juste du texte, vous pouvez l'omettre ou mettre 'text'.
             // Pour les erreurs, HttpClient essaiera quand même de parser si Content-Type est json.
            responseType: 'json', // Essayez avec 'json' ou 'text' selon ce que renvoie le SUCCES
            observe: 'response', // Optionnel: Pour obtenir la réponse complète (statut, etc.) même en cas de succès
            withCredentials: true
        }).pipe(
           // Attrape l'erreur et la passe à handleError
           catchError(this.handleError) // <<<<===== Point important
        );
    }

   resetPassword(token: string, newPassword: string): Observable<string> {
     const data = { token, newPassword };
     // L'endpoint /reset-password utilise le token, pas besoin d'email ici normalement
     return this.http.post(`${this.apiUrl}/reset-password`, data, {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
       responseType: 'text',
       withCredentials: true
     }).pipe(
         catchError(this.handleError) // Gérer les erreurs
     );
   }

   // --- Méthode de vérification de session ---
   // Si vous l'implémentez, assurez-vous que l'endpoint appelé (/profile/{id}) est sécurisé
   // et renvoie une erreur (ex: 401) si la session n'est pas valide.
   verifySessionOnLoad(): Observable<boolean> {
     const adminId = this.getAdminId();
     if (!adminId) {
         this.loggedIn.next(false);
         return new BehaviorSubject<boolean>(false).asObservable();
     }

     // Assurez-vous que cet endpoint est bien protégé par Spring Security
     return this.http.get<any>(`${this.apiUrl}/profile/${adminId}`, { withCredentials: true })
       .pipe(
         map(() => true), // Si succès (2xx), la session est valide
         tap((isValid) => {
           if (isValid) {
               this.loggedIn.next(true);
               console.log("AuthService: Session vérifiée avec succès au chargement.");
           }
         }),
         catchError((error: HttpErrorResponse) => {
           // Si 401 ou autre erreur, la session n'est probablement plus valide
           console.warn("AuthService: Vérification de session échouée (probablement 401/403). Déconnexion locale.", error.status);
           localStorage.removeItem(this.storageKey);
           this.loggedIn.next(false);
           // Retourner un Observable qui émet false
           return new BehaviorSubject<boolean>(false).asObservable();
         })
       );
   }

    // Helper pour la gestion d'erreur centralisée (optionnel)
    /*private handleError(error: HttpErrorResponse) {
        console.error('AuthService: Erreur HTTP', error);
        let errorMessage = 'Une erreur serveur est survenue.';
        if (error.status === 0) {
            errorMessage = 'Impossible de contacter le serveur.';
        } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
        } else if (error.error?.message) {
            errorMessage = error.error.message;
        } else if (error.statusText) {
             errorMessage = `Erreur ${error.status}: ${error.statusText}`;
        }
        return throwError(() => new Error(errorMessage));
    }*/
        private handleError(error: HttpErrorResponse) {
          // Log l'erreur complète pour le débogage
          console.error('AuthService: Erreur HTTP interceptée dans handleError:', error);
  
          // --- Logique pour tenter d'extraire un message utile ---
          // (Ceci est pour information ou logging, mais NE DOIT PAS modifier le type d'erreur retourné)
          let displayMessage = 'Une erreur inconnue est survenue.';
          if (error.status === 0 || error.error instanceof ProgressEvent) {
               displayMessage = 'Erreur de connexion ou serveur inaccessible.';
          } else if (error.status === 404) {
               // Essayer de lire le message du corps JSON de l'erreur 404
               displayMessage = error.error?.message || 'Ressource non trouvée (404).';
          } else if (error.error?.message) {
               // Pour les autres erreurs avec un corps JSON { message: "..." }
               displayMessage = error.error.message;
          } else if (typeof error.error === 'string' && error.error.trim() !== '') {
               // Si le corps de l'erreur est une simple chaîne non vide
               displayMessage = error.error;
          } else {
               // Fallback si rien d'autre n'est trouvé
               displayMessage = error.message || `Erreur HTTP ${error.status}`;
          }
          console.log("AuthService: Message d'erreur extrait pour affichage potentiel:", displayMessage);
          // --- Fin de la logique d'extraction (pour info) ---
  
  
          // *** LA CORRECTION EST ICI ***
          // Renvoyer l'objet HttpErrorResponse ORIGINAL via throwError.
          // NE PAS faire `new Error(...)` ici.
          return throwError(() => error); // <<<<<<<<<<<<<<<<<<<<<<<<<<< CORRECTION
      }
  
      // Dans AuthService
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