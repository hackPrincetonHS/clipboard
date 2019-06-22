import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { StorageService, UserData } from '../storage/storage.service'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public authService:  AuthService, public storageService: StorageService, public userData: UserData) { }

  ngOnInit() {
    this.storageService.userInfoObservable.subscribe((userDataTemp: UserData) => {
      console.log(userDataTemp);
      this.userData=userDataTemp;
    });
  }

}
