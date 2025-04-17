import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {CollectionpostmanComponent } from './collectionpostman/collectionpostman.component';
import { AppbarComponent } from './appbar/appbar.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { Token } from '@angular/compiler';
import { TokenComponent } from './token/token.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'admin-profile/:id', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'collection', component: CollectionpostmanComponent, canActivate: [AuthGuard]},
  { path: 'grafana', canActivate: [AuthGuard], component: HomeComponent },
  {path: 'reset-password', component: ForgotComponent},
  { path: 'token', component:TokenComponent }, // Ensure default route is login
  { path: 'login', component: LoginComponent } // ajouter
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
