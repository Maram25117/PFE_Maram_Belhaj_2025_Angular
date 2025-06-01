import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { SuccessResponse, ErrorResponse } from '../response.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string | null = null;
  showConfirmation: boolean = false;

  swaggerUrl: string = '';
  swaggerId: string = '';
  showSwaggerForm = false;
  isEditing = false;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    this.authService.getAdminName().subscribe(
      name => {
        this.username = name;
      },
      error => {
        console.error('Erreur lors de la récupération du nom de l\'utilisateur', error);
      }
    );

    this.loadSwaggerUrl();
  }

  navigateToCollectionPostman() {
    this.router.navigate(['/collection']);
  }

  openSwaggerDialog() {
    this.loadSwaggerUrl();
    this.showSwaggerForm = true;
    this.isEditing = true;
  }

  cancelSwaggerEdit() {
    this.showSwaggerForm = false;
    this.isEditing = false;
    this.clearMessages();
  }

  loadSwaggerUrl() {
    this.http.get<any>('http://localhost:8089/api/swagger-urls/1', { 
      withCredentials: true
    }).subscribe({
      next: data => {
        this.swaggerUrl = data.url;
        this.swaggerId = data.id; 
      },
      error: err => {
        console.error("Erreur lors du chargement de l'URL Swagger :", err);
        this.errorMessage = "Erreur de chargement de l'URL Swagger.";
        this.swaggerUrl = '';
        this.swaggerId = '';
      }
    });
  }

  saveSwaggerUrl() {
    this.clearMessages();

    if (!this.swaggerId) {
      this.errorMessage = "ID de l'URL Swagger non trouvé. Impossible de mettre à jour.";
      return;
    }
    if (!this.swaggerUrl.trim()) {
      this.errorMessage = "L'URL Swagger ne peut pas être vide.";
      return;
    }

    const updated = { url: this.swaggerUrl };

    this.http.put<SuccessResponse | ErrorResponse>(`http://localhost:8089/api/swagger-urls/${this.swaggerId}`, updated, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        this.isEditing = false;
        this.showSwaggerForm = false;

        if ((response as SuccessResponse).message) {
          this.successMessage = (response as SuccessResponse).message;
        } else {
          this.successMessage = "URL Swagger mise à jour avec succès.";
        }
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'URL Swagger :", err);
        if (err.error && (err.error as ErrorResponse).error) {
          this.errorMessage = (err.error as ErrorResponse).error;
        } else if (err.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = "Une erreur inconnue est survenue lors de la sauvegarde.";
        }
      }
    });
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

}


