import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate, Router, Route } from '@angular/router';
import { AuthService } from  '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class LoginActivate implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
