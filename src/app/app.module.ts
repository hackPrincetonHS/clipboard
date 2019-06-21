import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { OcticonDirective } from './octicon.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner, faMinus, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';


var firebaseConfig = {
    apiKey: "AIzaSyDzlH7XeqauTFE9PYpg9FYJizcOiUqd-U4",
    authDomain: "applications-and-checkins.firebaseapp.com",
    databaseURL: "https://applications-and-checkins.firebaseio.com",
    projectId: "applications-and-checkins",
    storageBucket: "applications-and-checkins.appspot.com",
    messagingSenderId: "911304854348",
    appId: "1:911304854348:web:ff085a1905f7d853"
};


@NgModule({
  declarations: [
    AppComponent,
    RegistrationFormComponent,
    OcticonDirective,
    LoginComponent,
    HeaderComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    DigitOnlyModule,
    HttpClientModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faSpinner);
    library.add(faMinus);
    library.add(faCheck);
    library.add(faTimes);
  }
}
