import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CanActivate, Router, Route } from '@angular/router';
import { AuthService } from  '../auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FullyLoggedIn implements CanActivate {
  constructor(private authService: AuthService, private router: Router, public fs: AngularFirestore) {}

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean>|boolean {
    //console.log("stupid");
    if(this.authService.isLoggedIn) {
      return this.fs.collection("users").doc(this.authService.userUid).get().pipe(map((snap) => {
        if(!snap.exists){
          this.router.navigate(['registration-form']);
          return false;
        }
        return true;
      }));
    }
    this.router.navigate(['login']);
    return false;
  }
}
