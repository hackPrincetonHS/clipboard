import { Component, OnInit } from  '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { Router } from  "@angular/router";
import * as lodash from 'lodash'


import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';


@Component({
selector:  'app-login',
templateUrl:  './login.component.html',
styleUrls: ['./login.component.css'],
animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      //when created
      transition('false=>true', [
        style({opacity: 0}),
        animate(300 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition('true=>false',
        animate(200, style({opacity: 0})))
    ]),

    trigger('shakeit', [
        state('in', style({
            transform: 'scale(1)',
        })),
        transition('false => true', animate('1000ms ease-in',     keyframes([
          style({transform: 'translate3d(-1px, 0, 0)', offset: 0.1}),
          style({transform: 'translate3d(2px, 0, 0)', offset: 0.2}),
          style({transform: 'translate3d(-4px, 0, 0)', offset: 0.3}),
          style({transform: 'translate3d(4px, 0, 0)', offset: 0.4}),
          style({transform: 'translate3d(-4px, 0, 0)', offset: 0.5}),
          style({transform: 'translate3d(4px, 0, 0)', offset: 0.6}),
          style({transform: 'translate3d(-4px, 0, 0)', offset: 0.7}),
          style({transform: 'translate3d(2px, 0, 0)', offset: 0.8}),
          style({transform: 'translate3d(-1px, 0, 0)', offset: 0.9}),
        ]))),
  ])
  ]
})



export  class  LoginComponent  implements  OnInit {
    badLoginAlert={"value": "false", "shake":false};
    register;
    registerShown;
    firstClickRegister=false;

    constructor(public authService:  AuthService, public router: Router) { }
    ngOnInit() {
      if(this.authService.isLoggedIn){
        this.router.navigate(['dashboard']);
      }
      this.register=false;
      this.registerShown=false;
    }
    clickButtonLogin(userEmail, userPassword) {
      this.badLoginAlert.value="false";
      if(this.register) {
        this.register=false;
      } else {
        this.authService.login(userEmail.value, userPassword.value, this.badLoginAlert);
      }
    }
    clickRegister(userEmail, userPassword, userConfirm){
      this.firstClickRegister=true;
      if(this.register) {
        if(userPassword.value!=userConfirm.value) {
          this.badLoginAlert.value="the passwords must match";
          this.badLoginAlert.shake=true;
        } else {
          this.badLoginAlert.value="false";
          this.authService.register(userEmail.value, userPassword.value, this.badLoginAlert);
        }
      } else {
        this.badLoginAlert.value="false";
      }
      this.register=true;
      this.registerShown=true;
    }
    toggleRegisterShown(){
      if(!this.register){
        this.registerShown=false;
      }
    }
}
