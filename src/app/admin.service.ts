import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8089/admin'; 

  constructor(private http: HttpClient) {}

  // Récupère le profil par ID
  getAdminProfile(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/${id}`, { withCredentials: true });
  }

    updateAdminInfo(id: number, data: any) {
      return this.http.put<any>(`${this.apiUrl}/update/info/${id}`, data, { withCredentials: true });
    }
    
    updateAdminPassword(id: number, data: any) {
      return this.http.put<any>(`${this.apiUrl}/update/password/${id}`, data, { withCredentials: true });
    }
    
    
}

