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
//import { BasicAuthInterceptor } from './basic-auth.interceptor';
//import { AuthInterceptor } from './basic-auth.interceptor';
import { CollectionpostmanComponent } from './collectionpostman/collectionpostman.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';



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
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [ /*{ provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }*/
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
