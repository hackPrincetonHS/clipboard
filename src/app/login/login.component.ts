import { Component, OnInit } from  '@angular/core';
import { AuthService } from  '../auth/auth.service';

@Component({
selector:  'app-login',
templateUrl:  './login.component.html',
styleUrls: ['./login.component.css']
})
export  class  LoginComponent  implements  OnInit {
    badLoginAlert={"value": false};
    constructor(public authService:  AuthService) { }
    ngOnInit() {}
}
