import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AppbarComponent } from './appbar/appbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForgotComponent } from './forgot/forgot.component';
import { TokenComponent } from './token/token.component';
import { CollectionpostmanComponent } from './collectionpostman/collectionpostman.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AlertComponent } from './alert/alert.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AppbarComponent,
    ForgotComponent,
    TokenComponent,
    CollectionpostmanComponent,
    FooterComponent,
    NavbarComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
