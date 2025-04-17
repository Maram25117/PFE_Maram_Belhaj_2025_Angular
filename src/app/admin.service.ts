/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8089/admin'; // URL de base

  constructor(private http: HttpClient) {}

  // Récupère le profil par ID
  getAdminProfile(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${id}`);
  }

  // Met à jour l'admin par ID
  updateAdmin(id: number, admin: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, admin);
  }
}*/
// Dans admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8089/admin'; // URL de base

  constructor(private http: HttpClient) {}

  // Récupère le profil par ID
  getAdminProfile(id: number): Observable<any> {
    // AJOUTER withCredentials: true
    return this.http.get(`${this.apiUrl}/profile/${id}`, { withCredentials: true });
  }

  // Met à jour l'admin par ID
  updateAdmin(id: number, admin: any): Observable<any> {
    // AJOUTER withCredentials: true
    return this.http.put(`${this.apiUrl}/update/${id}`, admin, { withCredentials: true });
  }
}

