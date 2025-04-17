/*import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.css']
})
export class AppbarComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Abonnez-vous à l'état de connexion
    this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngOnDestroy(): void {
    // Nettoyez l'abonnement lorsque le composant est détruit
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  handleLoginLogout(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
      console.log('Déconnexion réussie');
      this.router.navigate(['/']); // Redirige vers la page d'accueil ou la page de connexion
    } 
  }
}*/
/*import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
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

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.loadAdminProfile();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  handleLoginLogout(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
      console.log('Déconnexion réussie');
      this.router.navigate(['/']);
    }
  }

  toggleProfileForm(): void {
    this.showProfileForm = !this.showProfileForm;
  }
 
    loadAdminProfile(): void {
      this.adminService.getAdminProfile().subscribe(
        (data: any) => {
          this.admin.username = data.username;
          this.admin.email = data.email;
        },
        (error) => {
          console.error('Erreur lors du chargement du profil', error);
          alert('Erreur de chargement du profil');
        }
      );
    }
    
 
      updateProfile(): void {
        // Vérification si les champs sont remplis
        if (!this.admin.username || !this.admin.email || !this.admin.password) {
          alert('Veuillez remplir tous les champs');
          return;
        }
      
        // Utilisation de l'ID dynamique pour la mise à jour du profil
        const adminId = this.admin.id;  // L'ID de l'admin que vous voulez mettre à jour
        
        this.adminService.updateAdmin(adminId, this.admin).subscribe(
          (response: any) => {
            console.log(response);
            this.showProfileForm = false;
            alert('Profil mis à jour avec succès');
          },
          (error: any) => {
            console.error('Erreur lors de la mise à jour du profil', error);
            alert('Échec de la mise à jour du profil');
          }
        );
      }
      
    
  
}*/
/*import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
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

  private adminId: number = 0; // Will be assigned dynamically from the URL

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService,
    private route: ActivatedRoute // Inject ActivatedRoute to access the URL parameters
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    // Get the admin ID dynamically from the URL parameter
    this.route.paramMap.subscribe(params => {
      this.adminId = +params.get('id')!; // Dynamically get the admin ID from the URL
      this.loadAdminProfile(); // Load profile with the ID retrieved from the URL
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  handleLoginLogout(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
      console.log('Déconnexion réussie');
      this.router.navigate(['/']);
    }
  }

  toggleProfileForm(): void {
    this.showProfileForm = !this.showProfileForm;
  }

  loadAdminProfile(): void {
    // Load the admin profile using the dynamic admin ID from the URL
    this.adminService.getAdminProfile(this.adminId).subscribe(
      (data: any) => {
        this.admin.username = data.username;
        this.admin.email = data.email;
      },
      (error) => {
        console.error('Erreur lors du chargement du profil', error);
        alert('Erreur de chargement du profil');
      }
    );
  }

  
    updateProfile(): void {
      // Ensure the admin's information is complete before updating
      if (!this.admin.username || !this.admin.email || !this.admin.password) {
        alert('Veuillez remplir tous les champs');
        return;
      }
    
      // Update the admin profile using the dynamic admin ID from the URL
      this.adminService.updateAdmin(this.adminId, this.admin).subscribe(
        (response: any) => {
          console.log(response);
          if (response === 'Admin mis à jour avec succès') {
            this.showProfileForm = false;
            alert('Profil mis à jour avec succès');
          } else {
            alert('Échec de la mise à jour du profil');
          }
        },
        (error: any) => {
          console.error('Erreur lors de la mise à jour du profil', error);
          alert('Échec de la mise à jour du profil');
        }
      );
    }
    
}*/
/*import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // ActivatedRoute n'est plus nécessaire
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
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
  admin = { username: '', email: '', password: '' }; // Password pour le formulaire

  // --- MODIFICATION : adminId sera récupéré depuis AuthService ---
  private adminId: number | null = null; // Peut être null initialement

  constructor(
    private router: Router,
    private authService: AuthService,
    private adminService: AdminService
    // private route: ActivatedRoute // Plus nécessaire ici
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        // --- MODIFICATION : Récupérer l'ID depuis AuthService ---
        const storedId = this.authService.getAdminId();
        if (storedId) {
          this.adminId = parseInt(storedId, 10); // Convertir l'ID string en number
          if (!isNaN(this.adminId)) {
             console.log("AppbarComponent: Admin ID récupéré depuis AuthService:", this.adminId);
             this.loadAdminProfile(); // Charger le profil avec l'ID récupéré
          } else {
             console.error("AppbarComponent: ID stocké invalide:", storedId);
             this.adminId = null; // Marquer comme invalide
             // Gérer l'erreur? Déconnexion?
             this.authService.logout();
          }
        } else {
           console.error("AppbarComponent: Connecté mais ID non trouvé dans AuthService.");
           // L'état est incohérent, déconnecter pour être sûr
           this.authService.logout();
        }
      } else {
        // Si déconnecté, réinitialiser l'ID et les données
        this.adminId = null;
        this.admin = { username: '', email: '', password: '' };
        this.showProfileForm = false;
      }
    });

    // --- SUPPRIMÉ : Ne plus lire l'ID de l'URL ---
    // this.route.paramMap.subscribe(params => { ... });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  handleLoginLogout(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
      // La redirection vers /login est maintenant gérée dans authService.logout()
      console.log('Déconnexion demandée.');
    }
    // Si !isLoggedIn, ce bouton ne devrait pas faire de logout
  }

  toggleProfileForm(): void {
     if (this.isLoggedIn && this.adminId !== null) {
        this.showProfileForm = !this.showProfileForm;
        if (this.showProfileForm) {
          // Recharger les données fraîches si on ouvre le formulaire
          this.loadAdminProfile();
        }
     } else {
        console.warn("Impossible d'ouvrir le formulaire de profil : non connecté ou ID invalide.");
        this.showProfileForm = false;
     }
  }

  loadAdminProfile(): void {
    if (this.adminId === null) {
      console.error("loadAdminProfile: Impossible de charger, adminId est null.");
      return;
    }
    // --- OK : Utilise l'ID récupéré depuis AuthService ---
    this.adminService.getAdminProfile(this.adminId).subscribe(
      (data: any) => {
        this.admin.username = data.username;
        this.admin.email = data.email;
        this.admin.password = ''; // Ne pas pré-remplir le mot de passe actuel
        console.log("Profil chargé pour adminId:", this.adminId);
      },
      (error) => {
        console.error(`Erreur lors du chargement du profil pour l'ID ${this.adminId}`, error);
        // Si le profil n'est pas trouvé (404) ou accès interdit (401/403)
        if(error.status === 404) {
            alert(`Profil admin avec ID ${this.adminId} non trouvé.`);
        } else if (error.status === 401 || error.status === 403) {
            alert("Votre session est invalide. Reconnexion nécessaire.");
            this.authService.logout(); // Déconnecter si accès refusé
        } else {
            alert('Erreur de chargement du profil.');
        }
        this.adminId = null; // Marquer comme invalide si erreur
        this.isLoggedIn = false; // Supposer déconnecté si le profil échoue? Ou juste cacher le formulaire
        this.showProfileForm = false;
      }
    );
  }

  updateProfile(): void {
    if (this.adminId === null) {
       alert("Impossible de mettre à jour : ID Administrateur inconnu.");
       return;
    }
    if (!this.admin.username || !this.admin.email) { // Password peut être optionnel
      alert('Le nom d\'utilisateur et l\'email sont requis.');
      return;
    }

    // Préparer l'objet à envoyer, inclure le password seulement s'il est saisi
    const dataToUpdate: any = {
        username: this.admin.username,
        email: this.admin.email
    };
    if (this.admin.password) {
        dataToUpdate.password = this.admin.password;
    }

    // --- OK : Utilise l'ID récupéré depuis AuthService ---
    this.adminService.updateAdmin(this.adminId, dataToUpdate).subscribe(
      (response: any) => {
        // Adapter la vérification à la réponse réelle du backend (qui est maintenant un JSON)
        console.log("Réponse update:", response);
        alert(response.message || 'Profil mis à jour.'); // Utiliser le message du backend
        this.showProfileForm = false;
        this.admin.password = ''; // Vider le champ mot de passe après succès
        // Optionnel: recharger le profil pour voir les changements
        // this.loadAdminProfile();
      },
      (error: any) => {
        console.error(`Erreur lors de la mise à jour du profil pour l'ID ${this.adminId}`, error);
        alert(`Échec de la mise à jour du profil: ${error.error?.message || error.message || 'Erreur inconnue'}`);
      }
    );
  }
 
}*/




/*import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
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
  confirmPassword: string = ''; // Déclaration explicite

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
             console.log("AppbarComponent: Admin ID récupéré depuis AuthService:", this.adminId);
             // Charger seulement si le formulaire n'est pas déjà ouvert
             if (!this.showProfileForm) {
                this.loadAdminProfile();
             }
          } else {
             console.error("AppbarComponent: ID stocké invalide:", storedId);
             this.adminId = null;
             this.authService.logout();
          }
        } else {
           console.error("AppbarComponent: Connecté mais ID non trouvé dans AuthService.");
           this.authService.logout();
        }
      } else {
        this.adminId = null;
        this.admin = { username: '', email: '', password: '' };
        this.confirmPassword = ''; // Réinitialisation si déconnecté
        this.showProfileForm = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  handleLoginLogout(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
      console.log('Déconnexion demandée.');
    }
  }

  toggleProfileForm(): void {
     if (this.isLoggedIn && this.adminId !== null) {
        this.showProfileForm = !this.showProfileForm;
        if (this.showProfileForm) {
          this.loadAdminProfile();
        } else {
           // Réinitialiser les mots de passe quand on ferme
           this.admin.password = '';
           this.confirmPassword = '';
        }
     } else {
        console.warn("Impossible d'ouvrir le formulaire de profil : non connecté ou ID invalide.");
        this.showProfileForm = false;
     }
  }

  loadAdminProfile(): void {
    if (this.adminId === null) {
      console.error("loadAdminProfile: Impossible de charger, adminId est null.");
      return;
    }
    this.adminService.getAdminProfile(this.adminId).subscribe(
      (data: any) => {
        this.admin.username = data.username;
        this.admin.email = data.email;
        this.admin.password = ''; // Réinitialiser
        this.confirmPassword = ''; // Réinitialiser
        console.log("Profil chargé pour adminId:", this.adminId);
      },
      (error) => {
        console.error(`Erreur lors du chargement du profil pour l'ID ${this.adminId}`, error);
        if(error.status === 404) {
            alert(`Profil admin avec ID ${this.adminId} non trouvé.`);
        } else if (error.status === 401 || error.status === 403) {
            alert("Votre session est invalide. Reconnexion nécessaire.");
            this.authService.logout();
        } else {
            alert('Erreur de chargement du profil.');
        }
        this.adminId = null;
        this.isLoggedIn = false;
        this.showProfileForm = false;
      }
    );
  }

  updateProfile(): void {
      if (this.adminId === null) {
         alert("Impossible de mettre à jour : ID Administrateur inconnu.");
         return;
      }
      if (!this.admin.username || !this.admin.email) {
        alert('Le nom d\'utilisateur et l\'email sont requis.');
        return;
      }

      // Vérification de la correspondance des mots de passe
      if (this.admin.password) {
        if (this.admin.password !== this.confirmPassword) {
          alert('Les mots de passe ne correspondent pas.');
          return;
        }
      }

      // Préparer l'objet à envoyer
      const dataToUpdate: any = {
          username: this.admin.username,
          email: this.admin.email
      };
      if (this.admin.password) {
          dataToUpdate.password = this.admin.password;
      }

      // Appel au service
      this.adminService.updateAdmin(this.adminId, dataToUpdate).subscribe(
        (response: any) => {
          console.log("Réponse update:", response);
          alert(response.message || 'Profil mis à jour.');
          this.showProfileForm = false;
          this.admin.password = ''; // Réinitialiser après succès
          this.confirmPassword = ''; // Réinitialiser après succès
        },
        (error: any) => {
          console.error(`Erreur lors de la mise à jour du profil pour l'ID ${this.adminId}`, error);
          alert(`Échec de la mise à jour du profil: ${error.error?.message || error.message || 'Erreur inconnue'}`);
        }
      );
    }
}*/








import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
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
  confirmPassword: string = ''; // Déclaration explicite
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
            console.log("AppbarComponent: Admin ID récupéré depuis AuthService:", this.adminId);
            if (!this.showProfileForm) {
              this.loadAdminProfile();
            }
          } else {
            console.error("AppbarComponent: ID stocké invalide:", storedId);
            this.adminId = null;
            this.authService.logout();
          }
        } else {
          console.error("AppbarComponent: Connecté mais ID non trouvé dans AuthService.");
          this.authService.logout();
        }
      } else {
        this.adminId = null;
        this.admin = { username: '', email: '', password: '' };
        this.confirmPassword = ''; 
        this.showProfileForm = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  handleLoginLogout(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
      console.log('Déconnexion demandée.');
    }
  }

  toggleProfileForm(): void {
    if (this.isLoggedIn && this.adminId !== null) {
      this.showProfileForm = !this.showProfileForm;
      if (this.showProfileForm) {
        this.loadAdminProfile();
      } else {
        this.admin.password = '';
        this.confirmPassword = '';
      }
    } else {
      console.warn("Impossible d'ouvrir le formulaire de profil : non connecté ou ID invalide.");
      this.showProfileForm = false;
    }
  }

  loadAdminProfile(): void {
    if (this.adminId === null) {
      console.error("loadAdminProfile: Impossible de charger, adminId est null.");
      return;
    }
    this.adminService.getAdminProfile(this.adminId).subscribe(
      (data: any) => {
        this.admin.username = data.username;
        this.admin.email = data.email;
        this.admin.password = '';
        this.confirmPassword = '';
        console.log("Profil chargé pour adminId:", this.adminId);
      },
      (error) => {
        console.error(`Erreur lors du chargement du profil pour l'ID ${this.adminId}`, error);
        if (error.status === 404) {
          alert(`Profil admin avec ID ${this.adminId} non trouvé.`);
        } else if (error.status === 401 || error.status === 403) {
          alert("Votre session est invalide. Reconnexion nécessaire.");
          this.authService.logout();
        } else {
          alert('Erreur de chargement du profil.');
        }
        this.adminId = null;
        this.isLoggedIn = false;
        this.showProfileForm = false;
      }
    );
  }

  isValidInput(value: string): boolean {
    return value.trim().length > 1;
  }

  
  isValidEmail(email: string): boolean {
    return email.includes('@');
  }

  updateProfile(): void {
    if (this.adminId === null) {
      alert("Impossible de mettre à jour : ID Administrateur inconnu.");
      return;
    }

    // Validation des champs
    if (!this.isValidInput(this.admin.username)) {
      alert("Le nom d'utilisateur doit contenir plus d'une lettre.");
      return;
    }
    if (!this.isValidInput(this.admin.email) || !this.isValidEmail(this.admin.email)) {
      alert("L'email doit contenir plus d'une lettre et inclure '@'.");
      return;
    }

    if (this.admin.password) {
      if (!this.isValidInput(this.admin.password)) {
        alert("Le mot de passe doit contenir plus d'une lettre.");
        return;
      }
      if (this.admin.password !== this.confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }
    }

    // Préparer les données à envoyer
    const dataToUpdate: any = {
      username: this.admin.username,
      email: this.admin.email
    };
    if (this.admin.password) {
      dataToUpdate.password = this.admin.password;
    }

    // Envoi des données au service
    this.adminService.updateAdmin(this.adminId, dataToUpdate).subscribe(
      (response: any) => {
        console.log("Réponse update:", response);
        alert(response.message || 'Profil mis à jour.');
        this.showProfileForm = false;
        this.admin.password = ''; // Réinitialiser après succès
        this.confirmPassword = ''; // Réinitialiser après succès
      },
      (error: any) => {
        console.error(`Erreur lors de la mise à jour du profil pour l'ID ${this.adminId}`, error);
        alert(`Échec de la mise à jour du profil: ${error.error?.message || error.message || 'Erreur inconnue'}`);
      }
    );
  }

  
  navigateToAcceuil() {
    if (this.adminId !== null) {
      this.router.navigate([`/admin-profile/${this.adminId}`]);
    } else {
      console.warn("Impossible de naviguer vers le profil : ID admin introuvable.");
    }
  }
  
}