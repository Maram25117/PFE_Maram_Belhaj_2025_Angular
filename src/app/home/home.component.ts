import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) { }
  /*constructor(public authService: AuthService, private router: Router) {}*/

  username: string | null = null;

  /*ngOnInit(): void {
  }*/

  ngOnInit(): void {
    this.authService.getAdminName().subscribe(
      name => {
        this.username = name;
      },
      error => {
        console.error('Erreur lors de la récupération du nom de l\'utilisateur', error);
      }
    );
  }


  navigateToCollectionPostman() {
    this.router.navigate(['/collection']);
  }
  // Méthode pour rediriger vers Grafana uniquement si connecté
  /*redirectToGrafana(): void {
    if (this.authService.isLoggedIn()) {
      window.location.href = 'http://localhost:8089/swagger-ui/index.html';  // Remplacez par votre URL externe
      //this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login']);  // Si non connecté, rediriger vers la page de connexion
    }
  }*/
}
