import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { StorageService, UserData } from '../storage/storage.service'
import { Router } from  "@angular/router";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public authService:  AuthService, public storageService: StorageService, public userData: UserData, public router: Router) { }

  ngOnInit() {
    this.storageService.userInfoObservable.subscribe((userDataTemp: UserData) => {
      console.log(userDataTemp);
      this.userData=userDataTemp;
      if(!this.userData.isFullyLoggedIn) {
        this.router.navigate(['registration-form']);
      }
    });
  }

}
