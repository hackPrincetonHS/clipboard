import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  response={
    success : undefined,
    message : undefined,
    waiting : false
  }

  constructor(public authService:  AuthService, public router: Router) { }

  ngOnInit() {
  }
  resetPassword(){
    this.authService.sendPasswordResetEmail((<any>document.getElementById('login')).value,this.response);
    this.response.waiting=true;
  }

}
