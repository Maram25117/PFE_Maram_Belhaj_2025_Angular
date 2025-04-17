/*import { Component } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http'; // Importer HttpResponse pour observe: 'response'
import { Observable } from 'rxjs'; // Importer si vous utilisez des types Observable explicitement

@Component({
  selector: 'app-collectionpostman',
  templateUrl: './collectionpostman.component.html',
  styleUrls: ['./collectionpostman.component.css']
})
export class CollectionpostmanComponent {
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  showConfirmation: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file: File | null = event.target.files?.[0] || null;
    this.selectedFile = file;
    this.selectedFileName = this.selectedFile ? this.selectedFile.name : null;
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert("Veuillez sélectionner un fichier !");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // AJOUTER { withCredentials: true }
    this.http.post('http://localhost:8089/api/postman/upload-collection', formData, {
      responseType: 'text',
      withCredentials: true // <<<=== AJOUTÉ ICI
    }).subscribe({
      next: (response) => {
        alert(response);
        // this.selectedFile = null; // Optionnel : réinitialiser
        // this.selectedFileName = null;
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        alert("Erreur lors de l'envoi du fichier : " + errorMessage);
        console.error("Upload Error:", error); // Log pour plus de détails
      }
    });
  }

  downloadFile() {
    // AJOUTER { withCredentials: true }
    this.http.get('http://localhost:8089/api/postman/download-file', {
      responseType: 'blob',
      observe: 'response',
      withCredentials: true // <<<=== AJOUTÉ ICI
    }).subscribe({
      // Utilisation de type explicite pour la réponse
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        if (!blob) {
            alert("Erreur: Le fichier reçu est vide.");
            return;
        }

        let filename = 'collection_postman.json';
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
            }
        }

        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
      },
      error: (error) => {
        console.error("Download Error:", error); // Log pour plus de détails
        // Gestion d'erreur améliorée (inchangée par rapport à votre code)
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const errorResponse = JSON.parse(reader.result as string);
                alert("Erreur lors du téléchargement : " + (errorResponse.message || JSON.stringify(errorResponse)));
            } catch (parseError) {
                alert("Erreur lors du téléchargement : " + (error.message || 'Erreur inconnue. Vérifiez la console.'));
            }
        }
        reader.onerror = () => {
            alert("Erreur lors du téléchargement : " + (error.message || 'Erreur inconnue et impossible de lire la réponse.'));
        }
        if (error.error instanceof Blob) {
            reader.readAsText(error.error);
        } else {
             alert("Erreur lors du téléchargement : " + (error.error?.message || error.message || 'Erreur inconnue.'));
        }
      }
    });
  }

  confirmGenerateCollection() {
    this.showConfirmation = true;
  }

  generateCollection() {
    // AJOUTER { withCredentials: true }
    this.http.get('http://localhost:8089/postman/collection', {
        responseType: 'text',
        withCredentials: true // <<<=== AJOUTÉ ICI
    }).subscribe({
      next: (response) => {
        alert(response || "Collection générée avec succès !");
        this.showConfirmation = false;
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        alert("Erreur lors de la génération : " + errorMessage);
        console.error("Generate Collection Error:", error); // Log pour plus de détails
        this.showConfirmation = false;
      }
    });
  }

  cancelGenerate() {
    this.showConfirmation = false;
  }
}*/







/*import { Component, ViewChild, ElementRef } from '@angular/core'; // Importer ViewChild et ElementRef
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { SuccessResponse, ErrorResponse } from '../response.model'; // Assurez-vous que le chemin est correct

import { Observable } from 'rxjs';

@Component({
  selector: 'app-collectionpostman',
  templateUrl: './collectionpostman.component.html',
  styleUrls: ['./collectionpostman.component.css']
})
export class CollectionpostmanComponent {
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  showConfirmation: boolean = false;

  swaggerUrl: string = '';
  swaggerId: string = ''; // Si l'objet Swagger a un ID
  showSwaggerForm = false;
  isEditing = false;
  // Référence à l'élément input de type fichier dans le template
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>; // Utiliser '!' pour indiquer qu'il sera initialisé

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file: File | null = event.target.files?.[0] || null;
    this.selectedFile = file;
    this.selectedFileName = this.selectedFile ? this.selectedFile.name : null;
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert("Veuillez sélectionner un fichier !");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // AJOUTER { withCredentials: true }
    this.http.post('http://localhost:8089/api/postman/upload-collection', formData, {
      responseType: 'text',
      withCredentials: true // <<<=== Important pour la session
    }).subscribe({
      next: (response) => {
        alert(response);
        // Réinitialiser après succès
        this.resetFileSelection();
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        alert("Erreur lors de l'envoi du fichier : " + errorMessage);
        console.error("Upload Error:", error);
        // Ne pas réinitialiser en cas d'erreur pour que l'utilisateur puisse réessayer ou annuler
      }
    });
  }

  // --- NOUVELLE MÉTHODE pour annuler la sélection ---
  cancelFileSelection() {
    this.resetFileSelection();
  }

  // --- NOUVELLE MÉTHODE pour réinitialiser l'état ---
  private resetFileSelection() {
    this.selectedFile = null;
    this.selectedFileName = null;
    // Réinitialiser la valeur de l'input fichier pour permettre de resélectionner le même fichier
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }
  // --- Fin des nouvelles méthodes ---

  downloadFile() {
    // AJOUTER { withCredentials: true }
    this.http.get('http://localhost:8089/api/postman/download-file', {
      responseType: 'blob',
      observe: 'response',
      withCredentials: true // <<<=== Important pour la session
    }).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        if (!blob) {
            alert("Erreur: Le fichier reçu est vide.");
            return;
        }

        let filename = 'collection_postman.json';
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
              filename = matches[1].replace(/['"]/g, '');
            }
        }

        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
      },
      error: (error) => {
        console.error("Download Error:", error);
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const errorResponse = JSON.parse(reader.result as string);
                alert("Erreur lors du téléchargement : " + (errorResponse.message || JSON.stringify(errorResponse)));
            } catch (parseError) {
                alert("Erreur lors du téléchargement : " + (error.message || 'Erreur inconnue. Vérifiez la console.'));
            }
        }
        reader.onerror = () => {
            alert("Erreur lors du téléchargement : " + (error.message || 'Erreur inconnue et impossible de lire la réponse.'));
        }
        if (error.error instanceof Blob) {
            reader.readAsText(error.error);
        } else {
             alert("Erreur lors du téléchargement : " + (error.error?.message || error.message || 'Erreur inconnue.'));
        }
      }
    });
  }

  confirmGenerateCollection() {
    this.showConfirmation = true;
  }

  generateCollection() {
   
    this.http.get('http://localhost:8089/postman/collection', {
        responseType: 'text',
        withCredentials: true 
    }).subscribe({
      next: (response) => {
        alert(response || "Collection générée avec succès !");
        this.showConfirmation = false;
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        alert("Erreur lors de la génération : " + errorMessage);
        console.error("Generate Collection Error:", error);
        this.showConfirmation = false;
      }
    });
  }

  cancelGenerate() {
    this.showConfirmation = false;
  }


 
  ngOnInit() {
    this.loadSwaggerUrl();
  }
  
  openSwaggerDialog() {
    this.showSwaggerForm = true;
    this.isEditing = false;
  }
  
  cancelSwaggerEdit() {
    this.showSwaggerForm = false;
    this.isEditing = false;
    this.loadSwaggerUrl(); // recharge la version actuelle
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
        alert("Impossible de charger le lien Swagger.");
      }
    });
  }
  
  
  
  saveSwaggerUrl() {
    if (!this.swaggerId) {
      alert("Aucune URL Swagger trouvée à mettre à jour.");
      return;
    }
  
    const updated = { url: this.swaggerUrl };
  
    this.http.put<SuccessResponse | ErrorResponse>(`http://localhost:8089/api/swagger-urls/${this.swaggerId}`, updated, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        this.isEditing = false;
        this.showSwaggerForm = false;
        // Vérification si la réponse est un message de succès
        if ((response as SuccessResponse).message) {
          alert((response as SuccessResponse).message); // Affiche "URL enregistrée et données extraites avec succès."
        }
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'URL Swagger :", err);
        // Si l'erreur provient du backend (code 400), vous affichez le message d'erreur retourné
        if (err.status === 400) {
          alert((err.error as ErrorResponse).error);  // Affiche "L'URL fournie est invalide." ou "Impossible d'extraire les données du fichier Swagger."
        } else if (err.status === 404) {
          alert("URL Swagger non trouvée. Vérifiez l'ID.");
        } else {
          alert("Une erreur inconnue est survenue. Veuillez réessayer.");
        }
      }
    });
  }
  
  processPostmanFile() {
    if (!this.selectedFile) {
      alert("Veuillez sélectionner un fichier à traiter !");
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    this.http.post('http://localhost:8089/api/postman/process-file', formData, {
      responseType: 'text',
      withCredentials: true
    }).subscribe({
      next: (response) => {
        alert("Résultat du traitement : " + response);
        this.resetFileSelection();
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        alert("Erreur lors du traitement du fichier : " + errorMessage);
        console.error("Processing Error:", error);
      }
    });
  }
  
  
}*/

import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { SuccessResponse, ErrorResponse } from '../response.model'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-collectionpostman',
  templateUrl: './collectionpostman.component.html',
  styleUrls: ['./collectionpostman.component.css'] // Assurez-vous d'avoir ce fichier CSS
})
export class CollectionpostmanComponent implements OnInit { // Ajout de OnInit

  // --- State for Surveillance Upload ---
  selectedFileSurveillance: File | null = null;
  selectedFileNameSurveillance: string | null = null;
  @ViewChild('fileInputSurveillance') fileInputRefSurveillance!: ElementRef<HTMLInputElement>;

  // --- State for Script Upload ---
  selectedFileScript: File | null = null;
  selectedFileNameScript: string | null = null;
  @ViewChild('fileInputScript') fileInputRefScript!: ElementRef<HTMLInputElement>;

  // --- Other State Variables ---
  showConfirmation: boolean = false;
  swaggerUrl: string = '';
  swaggerId: string = '';
  showSwaggerForm = false;
  isEditing = false; // Utilisé pour savoir si on est en mode édition du lien Swagger

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSwaggerUrl(); // Charger l'URL Swagger au démarrage
  }

  // --- Methods for Surveillance Upload ---
  onFileSelectedSurveillance(event: any) {
    const file: File | null = event.target.files?.[0] || null;
    this.selectedFileSurveillance = file;
    this.selectedFileNameSurveillance = this.selectedFileSurveillance ? this.selectedFileSurveillance.name : null;
  }

  uploadFileSurveillance() {
    if (!this.selectedFileSurveillance) {
      alert("Veuillez sélectionner un fichier pour la surveillance !");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFileSurveillance);

    this.http.post('http://localhost:8089/api/postman/upload-collection', formData, {
      responseType: 'text',
      withCredentials: true
    }).subscribe({
      next: (response) => {
        alert(response);
        this.resetFileSelectionSurveillance();
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        alert("Erreur lors de l'envoi du fichier de surveillance : " + errorMessage);
        console.error("Surveillance Upload Error:", error);
        // Optionnel: réinitialiser même en cas d'erreur ?
        // this.resetFileSelectionSurveillance();
      }
    });
  }

  cancelFileSelectionSurveillance() {
    this.resetFileSelectionSurveillance();
  }

  private resetFileSelectionSurveillance() {
    this.selectedFileSurveillance = null;
    this.selectedFileNameSurveillance = null;
    if (this.fileInputRefSurveillance?.nativeElement) {
      this.fileInputRefSurveillance.nativeElement.value = '';
    }
  }

  // --- Methods for Script Upload ---
  onFileSelectedScript(event: any) {
    const file: File | null = event.target.files?.[0] || null;
    this.selectedFileScript = file;
    this.selectedFileNameScript = this.selectedFileScript ? this.selectedFileScript.name : null;
  }

  processPostmanFile() { // Renommé pour correspondre à l'action (traitement du fichier script)
    if (!this.selectedFileScript) {
      alert("Veuillez sélectionner un fichier pour les scripts !");
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFileScript); // Utilise selectedFileScript

    this.http.post('http://localhost:8089/api/postman/process-file', formData, {
      responseType: 'text',
      withCredentials: true
    }).subscribe({
      next: (response) => {
        alert("Résultat du traitement du fichier script : " + response);
        this.resetFileSelectionScript(); // Réinitialise l'état du fichier script
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        alert("Erreur lors du traitement du fichier script : " + errorMessage);
        console.error("Script Processing Error:", error);
        // Optionnel: réinitialiser même en cas d'erreur ?
        // this.resetFileSelectionScript();
      }
    });
  }

  cancelFileSelectionScript() {
    this.resetFileSelectionScript();
  }

  private resetFileSelectionScript() {
    this.selectedFileScript = null;
    this.selectedFileNameScript = null;
    if (this.fileInputRefScript?.nativeElement) {
      this.fileInputRefScript.nativeElement.value = '';
    }
  }

  // --- Other Methods (Download, Generate, Swagger) ---

  downloadFile() {
    this.http.get('http://localhost:8089/api/postman/download-file', {
      responseType: 'blob',
      observe: 'response',
      withCredentials: true
    }).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        if (!blob) {
          alert("Erreur: Le fichier reçu est vide.");
          return;
        }

        let filename = 'collection_postman.json';
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
      },
      error: (error) => {
        console.error("Download Error:", error);
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorResponse = JSON.parse(reader.result as string);
            alert("Erreur lors du téléchargement : " + (errorResponse.message || JSON.stringify(errorResponse)));
          } catch (parseError) {
            alert("Erreur lors du téléchargement : " + (error.message || 'Erreur inconnue. Vérifiez la console.'));
          }
        }
        reader.onerror = () => {
          alert("Erreur lors du téléchargement : " + (error.message || 'Erreur inconnue et impossible de lire la réponse.'));
        }
        if (error.error instanceof Blob) {
          reader.readAsText(error.error);
        } else {
          alert("Erreur lors du téléchargement : " + (error.error?.message || error.message || 'Erreur inconnue.'));
        }
      }
    });
  }

  confirmGenerateCollection() {
    this.showConfirmation = true;
  }

  generateCollection() {
    this.http.get('http://localhost:8089/postman/collection', { // Vérifiez si ce endpoint nécessite /api/
      responseType: 'text',
      withCredentials: true
    }).subscribe({
      next: (response) => {
        alert(response || "Collection générée avec succès !");
        this.showConfirmation = false;
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        alert("Erreur lors de la génération : " + errorMessage);
        console.error("Generate Collection Error:", error);
        this.showConfirmation = false;
      }
    });
  }

  cancelGenerate() {
    this.showConfirmation = false;
  }

  openSwaggerDialog() {
    // Charge la valeur actuelle avant d'ouvrir pour l'édition
    this.loadSwaggerUrl();
    this.showSwaggerForm = true;
    this.isEditing = true; // Mettre en mode édition
  }

  cancelSwaggerEdit() {
    this.showSwaggerForm = false;
    this.isEditing = false;
    // Pas besoin de recharger ici, l'URL n'a pas été modifiée
  }

  loadSwaggerUrl() {
    // Assumons que l'ID est toujours 1 ou qu'il y a une API pour obtenir l'URL actuelle
    this.http.get<any>('http://localhost:8089/api/swagger-urls/1', { // Utilisez un ID fixe ou une API appropriée
      withCredentials: true
    }).subscribe({
      next: data => {
        this.swaggerUrl = data.url;
        this.swaggerId = data.id; // Stocker l'ID pour la mise à jour
      },
      error: err => {
        console.error("Erreur lors du chargement de l'URL Swagger :", err);
        // Peut-être initialiser avec une chaîne vide ou gérer l'erreur autrement
        this.swaggerUrl = '';
        this.swaggerId = '';
        // alert("Impossible de charger le lien Swagger actuel.");
      }
    });
  }

  saveSwaggerUrl() {
    if (!this.swaggerId) {
      alert("ID de l'URL Swagger non trouvé. Impossible de mettre à jour.");
      return;
    }
    if (!this.swaggerUrl.trim()) {
       alert("L'URL Swagger ne peut pas être vide.");
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
          alert((response as SuccessResponse).message);
        } else {
          alert("URL Swagger mise à jour avec succès."); // Message par défaut
        }
        // Recharger l'URL après la sauvegarde n'est pas strictement nécessaire
        // car elle est déjà à jour dans le modèle, mais peut être fait pour confirmer
        // this.loadSwaggerUrl();
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'URL Swagger :", err);
        let errorMsg = "Une erreur inconnue est survenue lors de la sauvegarde.";
        if (err.error && (err.error as ErrorResponse).error) {
          errorMsg = (err.error as ErrorResponse).error; // Message d'erreur du backend
        } else if (err.message) {
          errorMsg = err.message;
        }
        alert(errorMsg);
        // Ne pas fermer le dialogue en cas d'erreur pour permettre la correction
      }
    });
  }
}