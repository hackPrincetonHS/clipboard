import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { StorageService, UserData, Upload } from '../storage/storage.service'
import { Router } from  "@angular/router";
import * as moment from 'moment';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  inputEmailConfirm;

  loaded=false;
  resumeModal={
    file:undefined,
    attemptSubmit:false,
    uploading:false,
    uploadPercentage:undefined,
    const:50,
    saveChanges:undefined
  }

  resumeLink: Observable<String>;
  
  // vaccinationLink
  vaccinationLink: Observable<String>;
  constructor(public authService:  AuthService, public storageService: StorageService, public userData: UserData, public router: Router, public upload: Upload, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.storageService.userInfoObservable.subscribe((userDataTemp: UserData) => {
      //console.log(userDataTemp);
      this.userData=userDataTemp;
      if(!this.userData.isFullyLoggedIn) {
        this.router.navigate(['registration-form']);
      }else if(this.userData.hasResume){ // ONLY RESUME
        
        this.resumeLink=this.storageService.resumeLink;
        this.resumeLink.subscribe((resumeLink: String) => {
          this.loaded=true;
        });

      } else {
        this.loaded=true;
      }
    });
        
    

  }

  formatDate(){
    return moment(this.userData.dateOfBirth, 'YYYY-MM-DD').format('MMMM Do YYYY');
  }
  arrayAsString(a){
    return (<any>a).join(", ");
  }
  toFullSizeWord(size){
    var ret;
    switch (size) {
      case 'S':
        ret='Small';
        break;
      case 'M':
        ret='Medium';
        break;
      case 'L':
        ret='Large';
        break;
      case 'XL':
        ret='Extra Large';
        break;
      case 'XXL':
        ret='XXL';
        break;
      default:
        ret="Error, if you see this, please email us";
    }
    return ret;
  }
}
