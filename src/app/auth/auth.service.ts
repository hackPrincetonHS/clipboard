import { Injectable } from  '@angular/core';
import {Observable} from 'rxjs';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';

@Injectable({
  providedIn:  'root'
})
export  class  AuthService {
  user: User;

  constructor(public  afAuth:  AngularFireAuth, public  router:  Router) {}
  async  login(email:  string, password:  string, alertToActivate) {
    try {
      this.user = (await this.afAuth.auth.signInWithEmailAndPassword(email, password)).user;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.router.navigate(['dashboard']);
    } catch (e) {
      alertToActivate.value=e.message;
      alertToActivate.shake=true;
    }
  }
  async  register(email:  string, password:  string, alertToActivate) {
    console.log("here")
    try {
      this.user = (await  this.afAuth.auth.createUserWithEmailAndPassword(email, password)).user;
      localStorage.setItem('user', JSON.stringify(this.user));
      this.router.navigate(['registration-form']);
    } catch (e) {
      console.log(e);
      alertToActivate.value=e.message;
    }
  }
  async sendPasswordResetEmail(email : string, response) {
    try {
      await this.afAuth.auth.sendPasswordResetEmail(email);
      response.success=true;
      response.message="An email has been sent to "+email;
    } catch {
      response.success=false;
      response.message="There is no user with that email";
    }
    response.waiting=false;

  }
/*
  async resetPassword(email: string) {
    await this.afAuth.sendPasswordResetEmail(email);
  }
*/
  get userEmail(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.email;
  }
  get isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
  }
  get userUid(){
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return user.uid;
  }

  async logout(){
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }
}
