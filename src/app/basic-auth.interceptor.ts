/*import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Ajustez le chemin si nécessaire

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Récupérer les identifiants stockés
    const username = this.authService.getCurrentUsername();
    const password = this.authService.getCurrentPassword();
    const isLoggedIn = this.authService.isLoggedIn(); // Vérifie si on est censé être connecté

    // Vérifier si l'utilisateur est connecté ET si des identifiants existent
    if (isLoggedIn && username && password) {
      // Ne pas ajouter l'en-tête si c'est la requête de login elle-même (si elle n'utilise pas Basic Auth)
      // Adapter cette condition si nécessaire
      if (!request.url.endsWith('/admin/login')) {
        // Construire l'en-tête Basic Auth
        const authHeader = 'Basic ' + btoa(username + ':' + password);

        // Cloner la requête et ajouter le nouvel en-tête
        request = request.clone({
          setHeaders: {
            Authorization: authHeader
          }
        });
        // console.log('BasicAuthInterceptor: Authorization header added to request for', request.url);
      }
    }

    // Passer la requête (originale ou clonée) au prochain handler
    return next.handle(request);
  }
}*/
