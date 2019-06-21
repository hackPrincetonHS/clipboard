import { Injectable } from  '@angular/core';
import { Router } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';

@Injectable({
  providedIn:  'root'
})
export  class  AuthService {
  user: User;
  constructor(public  afAuth:  AngularFireAuth, public  router:  Router) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }
  async  login(email:  string, password:  string, alertToActivate) {

    try {
      await  this.afAuth.auth.signInWithEmailAndPassword(email, password)
      this.router.navigate(['registration-form']);
    } catch (e) {
      alertToActivate.value=e.message;
      alertToActivate.shake=true;
    }
  }
  async  register(email:  string, password:  string, alertToActivate) {
    try {
      await  this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      this.router.navigate(['registration-form']);
    } catch (e) {
      alertToActivate.value=e.message;
    }
  }

  get userEmail(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.email;
  }
  get isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
  }

  async logout(){
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
