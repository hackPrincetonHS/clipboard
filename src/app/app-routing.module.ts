import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegistrationFormComponent } from './registration-form/registration-form.component'
import { LoginComponent } from './login/login.component'
import { DashboardComponent } from './dashboard/dashboard.component'

import { LoginActivate } from './guards/login-activate.guard'
import { FullyLoggedIn } from './guards/fully-logged-in.guard'
import { NotLoggedIn } from './guards/not-logged-in.guard'

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'registration-form', component: RegistrationFormComponent, canActivate:[LoginActivate] },
  { path: 'login', component: LoginComponent, canActivate:[NotLoggedIn] },
  { path: 'dashboard', component: DashboardComponent, canActivate:[LoginActivate, FullyLoggedIn] }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }
