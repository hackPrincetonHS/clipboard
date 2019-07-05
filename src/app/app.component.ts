import { Component, OnInit } from '@angular/core';
import { AuthService } from  './auth/auth.service';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements  OnInit {
    constructor(public  authService:  AuthService, public router: Router) { }
    ngOnInit() {}
    dashboard(){
      this.router.navigate(['dashboard']);
    }
}
