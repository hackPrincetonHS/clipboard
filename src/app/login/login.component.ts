import { Component, OnInit } from  '@angular/core';
import { AuthService } from  '../auth/auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
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
      transition(':enter', [
        style({opacity: 0}),
        animate(300 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(200, style({opacity: 0})))
    ])
  ]
})



export  class  LoginComponent  implements  OnInit {
    badLoginAlert={"value": false};
    register;
    constructor(public authService:  AuthService) { }
    ngOnInit() {
      this.register=false;
    }
    clickButtonLogin(userEmail, userPassword) {
      if(this.register) {
        this.register=false;
      } else{
        this.authService.login(userEmail.value, userPassword.value, this.badLoginAlert);
      }
    }
}
