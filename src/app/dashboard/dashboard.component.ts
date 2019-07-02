import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { StorageService, UserData } from '../storage/storage.service'
import { Router } from  "@angular/router";
import * as moment from 'moment';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  showingResumeLink=true;
  resumeLink="TODO"
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
  formatDate(){
    return moment(this.userData.dateOfBirth, 'YYYY-MM-DD').format('MMMM Do YYYY');
  }
  arrayAsString(a){
  return (<any>a).join(", ");
  }
}
