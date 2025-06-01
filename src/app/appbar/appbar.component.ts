
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.css']
})
export class AppbarComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;
  showProfileForm: boolean = false;

  admin = { username: '', email: '', password: '' };
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  alertMessage: string = ''; 
  private adminId: number | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;

      if (this.isLoggedIn) {
        const storedId = this.authService.getAdminId();
        if (storedId) {
          this.adminId = parseInt(storedId, 10);
          if (!isNaN(this.adminId)) {
            this.loadAdminProfile();
          } else {
            console.error("ID invalide trouvé:", storedId);
            this.authService.logout();
          }
        } else {
          console.error("ID non trouvé");
          this.authService.logout();
        }
      } else {
        this.adminId = null;
        this.resetFormData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleProfileForm(): void {
    if (this.isLoggedIn && this.adminId !== null) {
      this.showProfileForm = !this.showProfileForm;
      if (this.showProfileForm) {
        this.loadAdminProfile();
      } else {
        this.resetFormData();
      }
    } else {
      this.showAlert("Non connecté ou ID invalide.");
      this.showProfileForm = false;
    }
  }

  loadAdminProfile(): void {
    if (this.adminId === null) return;

    this.adminService.getAdminProfile(this.adminId).subscribe(
      (data: any) => {
        this.admin.username = data.username;
        this.admin.email = data.email;
      },
      (error) => {
        console.error("Erreur de chargement du profil", error);
        this.showAlert('Erreur de chargement du profil');
        this.authService.logout();
      }
    );
  }

  handleLoginLogout(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
    }
  }

  navigateToAcceuil(): void {
    if (this.adminId !== null) {
      this.router.navigate([`/admin-profile/${this.adminId}`]);
    } else {
      this.showAlert("ID admin manquant");
    }
  }

  updateProfile(): void {
    if (this.adminId === null) {
      this.showAlert("ID admin introuvable");
      return;
    }

    if (!this.admin.username.trim() || !this.admin.email.includes('@')) {
      this.showAlert("Nom d'utilisateur ou email invalide.");
      return;
    }

    const data = {
      username: this.admin.username,
      email: this.admin.email
    };

    this.adminService.updateAdminInfo(this.adminId, data).subscribe(
      res => {
        this.showAlert(res.message || "Profil mis à jour.");
        this.showProfileForm = false;
        this.resetFormData();
      },
      err => {
        this.showAlert(err.error?.message || "Erreur lors de la mise à jour");
      }
    );
  }

  updatePassword(): void {
    if (this.adminId === null) {
      this.showAlert("ID admin introuvable");
      return;
    }

    if (!this.oldPassword || !this.newPassword || !this.confirmNewPassword) {
      this.showAlert("Tous les champs de mot de passe sont requis.");
      return;
    }

    if (this.newPassword.length < 6) {
      this.showAlert("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (this.newPassword !== this.confirmNewPassword) {
      this.showAlert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    const data = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.adminService.updateAdminPassword(this.adminId, data).subscribe(
      res => {
        this.showAlert(res.message || "Mot de passe mis à jour.");
        this.resetFormData();
        this.showProfileForm = false;
      },
      err => {
        this.showAlert(err.error?.message || "Erreur lors de la mise à jour du mot de passe.");
      }
    );
  }

  closeAlert(): void {
    this.alertMessage = '';
  }

  private resetFormData(): void {
    this.admin = { username: '', email: '', password: '' };
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  private showAlert(message: string): void {
    this.alertMessage = message;
  }
}
