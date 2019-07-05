import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { StorageService, UserData, Upload } from '../storage/storage.service'
import { Router } from  "@angular/router";
import * as moment from 'moment';
import * as lodash from 'lodash';
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
  constructor(public authService:  AuthService, public storageService: StorageService, public userData: UserData, public router: Router, public upload: Upload) { }

  ngOnInit() {
    console.log(this.authService.userEmail);

    this.resumeModal.saveChanges=function(self){
      console.log("stupid");
      self.resumeModal.attemptSubmit=true;
      if(self.resumeModal.file){
        self.userData.hasResume=true;
        self.resumeModal.uploading=true;
        self.upload.file=self.resumeModal.file;
        self.storageService.uploadFile(self.upload);
        console.log("starting");
        self.upload.progress.subscribe((x: number) => {
          self.resumeModal.uploadPercentage=x;
          if(self.resumeModal.uploadPercentage==100){
            console.log("done");
            //you want it to complete before moving on, otherwise it calls too quickly and the bar is only half full when it stops.
            //looks better, feels better. I use lodash instead of settimeout because I already use lodash in another part of the class so like...
            //this has to be passed  because it becomes an anon function. This is delt with later in the submitting funciton
            self.storageService.createUser(self.userData).then(lodash.delay(self.closeModal, 900, "#changeResumeModal"));
          }
        });
      }
    }

    this.storageService.userInfoObservable.subscribe((userDataTemp: UserData) => {
      console.log(userDataTemp);
      this.userData=userDataTemp;
      if(!this.userData.isFullyLoggedIn) {
        this.router.navigate(['registration-form']);
      } else if(this.userData.hasResume) {
        this.resumeLink=this.storageService.resumeLink;
        this.resumeLink.subscribe((resumeLink: String) => {
          this.loaded=true;
        });
      } else {
        this.loaded=true;
      }
    });
  }

  //I kinda forgot I could do arrow functions (which keep the "this") in es6, and tried a bunch of crappy workarounds
  deleteResume() {
    this.userData.hasResume=false;
    this.storageService.createUser(this.userData).then(() => {
      this.storageService.deleteResume();
      this.closeModal("#delete-resume-modal", true);
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
  edit(event){
    this.router.navigate(['profile-edit']);
  }
  closeModal(id, reload){
    (<any>$(id)).modal('toggle');
    if(reload===undefined || reload){
      location.reload();
    }
  }

}
