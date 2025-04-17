import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // Vérifie si l'utilisateur est authentifié
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);  // Si non, redirige vers la page de login
      return false;
    }
  }
}
