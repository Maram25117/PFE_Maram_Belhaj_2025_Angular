import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { SuccessResponse, ErrorResponse } from '../response.model';

@Component({
  selector: 'app-collectionpostman',
  templateUrl: './collectionpostman.component.html',
  styleUrls: ['./collectionpostman.component.css']
})
export class CollectionpostmanComponent implements OnInit {

  selectedFileSurveillance: File | null = null;
  selectedFileNameSurveillance: string | null = null;
  @ViewChild('fileInputSurveillance') fileInputRefSurveillance!: ElementRef<HTMLInputElement>;

  selectedFileScript: File | null = null;
  selectedFileNameScript: string | null = null;
  @ViewChild('fileInputScript') fileInputRefScript!: ElementRef<HTMLInputElement>;

  showConfirmation: boolean = false;
  swaggerUrl: string = '';
  swaggerId: string = '';
  showSwaggerForm = false;
  isEditing = false;

  alertMessage: string = '';
  alertType: 'success' | 'error' | 'info' = 'info';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSwaggerUrl();
  }


closeAlert(): void {
  this.alertMessage = '';
}

  onFileSelectedSurveillance(event: any) {
    const file: File | null = event.target.files?.[0] || null;
    if (file) {
      const isJson = file.type === 'application/json' && file.name.endsWith('.json');
      if (!isJson) {
        this.alertMessage = "Veuillez sélectionner uniquement un fichier .json pour la surveillance !";
        this.alertType = 'error';
        this.resetFileSelectionSurveillance();
        return;
      }
      this.selectedFileSurveillance = file;
      this.selectedFileNameSurveillance = file.name;
    }
  }

  uploadFileSurveillance() {
    if (!this.selectedFileSurveillance) {
      this.alertMessage = "Veuillez sélectionner un fichier pour la surveillance !";
      this.alertType = 'error';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFileSurveillance);

    this.http.post('http://localhost:8089/api/postman/upload-collection', formData, {
      responseType: 'text',
      withCredentials: true
    }).subscribe({
      next: (response) => {
        this.alertMessage = response;
        this.alertType = 'success';
        this.resetFileSelectionSurveillance();
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        this.alertMessage = "Erreur lors de l'envoi du fichier de surveillance : " + errorMessage;
        this.alertType = 'error';
        console.error("Surveillance Upload Error:", error);
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

  onFileSelectedScript(event: any) {
    const file: File | null = event.target.files?.[0] || null;
    if (file) {
      const isJson = file.type === 'application/json' && file.name.endsWith('.json');
      if (!isJson) {
        this.alertMessage = "Veuillez sélectionner uniquement un fichier .json pour les scripts !";
        this.alertType = 'error';
        this.resetFileSelectionScript();
        return;
      }
      this.selectedFileScript = file;
      this.selectedFileNameScript = file.name;
    }
  }

  processPostmanFile() {
    if (!this.selectedFileScript) {
      this.alertMessage = "Veuillez sélectionner un fichier pour les scripts !";
      this.alertType = 'error';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFileScript);

    this.http.post('http://localhost:8089/api/postman/process-file', formData, {
      responseType: 'text',
      withCredentials: true
    }).subscribe({
      next: (response) => {
        this.alertMessage = "Résultat du traitement du fichier script : " + response;
        this.alertType = 'success';
        this.resetFileSelectionScript();
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        this.alertMessage = "Erreur lors du traitement du fichier script : " + errorMessage;
        this.alertType = 'error';
        console.error("Script Processing Error:", error);
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

  downloadFile() {
    this.http.get('http://localhost:8089/api/postman/download-file', {
      responseType: 'blob',
      observe: 'response',
      withCredentials: true
    }).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        if (!blob) {
          this.alertMessage = "Erreur: Le fichier reçu est vide.";
          this.alertType = 'error';
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
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorResponse = JSON.parse(reader.result as string);
            this.alertMessage = "Erreur lors du téléchargement : " + (errorResponse.message || JSON.stringify(errorResponse));
          } catch (parseError) {
            this.alertMessage = "Erreur lors du téléchargement : " + (error.message || 'Erreur inconnue.');
          }
          this.alertType = 'error';
        }
        reader.onerror = () => {
          this.alertMessage = "Erreur lors du téléchargement : " + (error.message || 'Erreur inconnue.');
          this.alertType = 'error';
        }
        if (error.error instanceof Blob) {
          reader.readAsText(error.error);
        } else {
          this.alertMessage = "Erreur lors du téléchargement : " + (error.error?.message || error.message || 'Erreur inconnue.');
          this.alertType = 'error';
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
        this.alertMessage = response || "Collection générée avec succès !";
        this.alertType = 'success';
        this.showConfirmation = false;
      },
      error: (error) => {
        const errorMessage = error.error || error.message || 'Une erreur inconnue est survenue.';
        this.alertMessage = "Erreur lors de la génération : " + errorMessage;
        this.alertType = 'error';
        this.showConfirmation = false;
        console.error("Generate Collection Error:", error);
      }
    });
  }

  cancelGenerate() {
    this.showConfirmation = false;
  }

  openSwaggerDialog() {
    this.loadSwaggerUrl();
    this.showSwaggerForm = true;
    this.isEditing = true;
  }

  cancelSwaggerEdit() {
    this.showSwaggerForm = false;
    this.isEditing = false;
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
        this.swaggerUrl = '';
        this.swaggerId = '';
      }
    });
  }

  saveSwaggerUrl() {
    if (!this.swaggerId) {
      this.alertMessage = "ID de l'URL Swagger non trouvé. Impossible de mettre à jour.";
      this.alertType = 'error';
      return;
    }
    if (!this.swaggerUrl.trim()) {
      this.alertMessage = "L'URL Swagger ne peut pas être vide.";
      this.alertType = 'error';
      return;
    }

    const updated = { url: this.swaggerUrl };

    this.http.put<SuccessResponse | ErrorResponse>(`http://localhost:8089/api/swagger-urls/${this.swaggerId}`, updated, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        this.isEditing = false;
        this.showSwaggerForm = false;
        this.alertMessage = (response as SuccessResponse).message || "URL Swagger mise à jour avec succès.";
        this.alertType = 'success';
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour de l'URL Swagger :", err);
        let errorMsg = "Une erreur inconnue est survenue lors de la sauvegarde.";
        if (err.error && (err.error as ErrorResponse).error) {
          errorMsg = (err.error as ErrorResponse).error;
        } else if (err.message) {
          errorMsg = err.message;
        }
        this.alertMessage = errorMsg;
        this.alertType = 'error';
      }
    });
  }
}

