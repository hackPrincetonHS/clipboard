import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { StorageService, UserData } from '../storage/storage.service';
import { Router } from  "@angular/router";
import * as moment from 'moment';
import * as lodash from 'lodash';
import Utils from '../utils/utils';
import { HttpClient } from '@angular/common/http';
import {firestore} from 'firebase/app';



@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css']
})
export class EditInfoComponent implements OnInit {


  loaded=false;

  //have to list all the properties out for AOT compiler
  inputFirstName;
  inputLastName;
  inputEmail;
  inputPhone1;
  inputPhone2;
  inputPhone3;
  inputMonth;
  inputDay;
  inputYear;
  pickGender;
  ethnicity;
  schoolInput;
  schoolInputText;
  studyLevel;
  graduationYear;
  specialAccomadations;
  latino;
  shirtSize;
  haveGithub;
  haveResume;
  dietaryRestrictions;
  githubLinkInput;

  checkGithubProfile;
  schoolList=Utils.schoolList;

  hardwareList=Utils.hardwareList;

  validateClicked=false;

  attemptNext=false;

  constructor(private cdr: ChangeDetectorRef, private httpClient: HttpClient, public authService:  AuthService, public userData: UserData, public storageService: StorageService, public router: Router) { }

  ngOnInit() {
    this.storageService.userInfoObservable.subscribe((userDataTemp: UserData) => {
      this.userData=userDataTemp;
      console.log(this.userData);
      this.loaded=true;
      this.haveGithub=(this.userData.githubLink ? "Yes" : "No");
      this.pickGender=this.userData.gender;
      this.checkGithubProfile=lodash.throttle(this.sendCheckGithubProfile, 2000);

      if(this.userData.githubLink) {
        this.cdr.detectChanges();
        (<any>document.getElementById("githubLinkInput")).profileData=this.userData.githubLink;
      }
      this.latino=(this.userData.latino ? "Yes" : "No");


      //set up all the dropdowns.
      //you have to both set the value (to update what it looks like), and manually set the starting value.

      (<any>$('select')).selectpicker();

      (<any>$('#race-ethnicity')).selectpicker('val', this.userData.ethnicity);
      this.ethnicity=this.userData.ethnicity;

      if(this.userData.schoolNotInList) {
        (<any>$('#schoolInput')).selectpicker('val', 'My school isn\'t here');
        this.schoolInput='My school isn\'t here';
        this.schoolInputText=this.userData.school;
      } else {
        (<any>$('#schoolInput')).selectpicker('val', this.userData.school);
        this.schoolInput=this.userData.school;
      }

      (<any>$('#studyLevel')).selectpicker('val', this.userData.studyLevel);
      this.studyLevel=this.userData.studyLevel;

      (<any>$('#graduationYear')).selectpicker('val', this.userData.graduationYear);
      this.graduationYear=this.userData.graduationYear;

      (<any>$('#shirtSize')).selectpicker('val', this.userData.shirtSize);
      this.shirtSize=this.userData.shirtSize;

      (<any>$('#dietaryRestrictions')).selectpicker('val', this.userData.dietaryRestrictions);

    });
  }
  ngAfterContentChecked() {
    //have to cast to any or it won't compile
    //this is the only working way to do it on stackoverflow, so it's the only solution
    (<any>$('select')).selectpicker();
    (<any>$('[data-toggle="tooltip"]')).tooltip();
  }

  autoTab(event, nextInput) {
    let input = event.target;
    let length = input.value.length;
    let maxLength = input.attributes.maxlength.value;
    if (length >= maxLength) {
      document.getElementById(nextInput).focus();
      (<any>document.getElementById(nextInput)).select();
    }
  }
  validateDate() {
    if(!this.loaded){
      return true;
    }
    let month=(this.inputMonth ? this.inputMonth : this.userData.dateOfBirth.split("-")[1]);
    let day=(this.inputDay ? this.inputDay : this.userData.dateOfBirth.split("-")[2]);
    let year=(this.inputYear ? this.inputYear : this.userData.dateOfBirth.split("-")[0]);
    var mom=moment(year+"-"+month+"-"+day, "YYYY-MM-DD");
    return mom.isValid() && mom.year()>1900 && mom.isBefore(moment());
  }

  checkPage() {
    this.attemptNext=true;
    this.cdr.detectChanges();
    //console.log(document.getElementsByClassName("alert"))
    return document.getElementsByClassName("alert-danger").length==0;
  }
  back(){
    this.router.navigate(['dashboard']);
  }

  submitting() {
    window.scroll(0,0);
    if(this.checkPage()){
      var oldUserData=lodash.cloneDeep(this.userData);

      var phoneArr=oldUserData.phone.split("-");
      if(!this.inputPhone1){
        this.inputPhone1=phoneArr[0];
      }
      if(!this.inputPhone2){
        this.inputPhone2=phoneArr[1];
      }
      if(!this.inputPhone3){
        this.inputPhone3=phoneArr[2];
      }
      var dobArr=oldUserData.dateOfBirth.split("-");
      if(!this.inputYear){
        this.inputYear=dobArr[0];
      }
      if(!this.inputMonth){
        this.inputMonth=dobArr[1];
      }
      if(!this.inputDay){
        this.inputDay=dobArr[2];
      }

      this.userData.isFullyLoggedIn=true;
      this.userData.uid=this.authService.userUid;
      this.userData.firstName=this.inputFirstName;
      this.userData.lastName=this.inputLastName;
      this.userData.phone=this.inputPhone1+"-"+this.inputPhone2+"-"+this.inputPhone3;
      this.userData.dateOfBirth=this.inputYear+"-"+this.inputMonth+"-"+this.inputDay;
      this.userData.latino=this.latino=="Yes";
      this.userData.gender=this.pickGender;
      this.userData.ethnicity=this.ethnicity;
      if(this.schoolInput=="My school isn't here") {
        this.userData.school=this.schoolInputText;
        this.userData.schoolNotInList=true;
      } else {
        this.userData.school=this.schoolInput;
        this.userData.schoolNotInList=false;
      }
      this.userData.studyLevel=this.studyLevel;
      this.userData.graduationYear=this.graduationYear;
      this.userData.specialAccomadations=this.specialAccomadations;
      this.userData.shirtSize=this.shirtSize;
      this.userData.dietaryRestrictions=this.dietaryRestrictions;
      if(this.haveGithub=="Yes"){
        this.userData.githubLink=this.githubLinkInput;
      } else {
        this.userData.githubLink="";
      }
      this.userData.dateCreated=firestore.Timestamp.fromDate(new Date());
      for (var property in this.userData) {
        if (this.userData.hasOwnProperty(property)) {
          if(this.userData[property]===undefined){
            this.userData[property]=oldUserData[property];
          }
        }
      }
      this.userData.fullName=this.userData.firstName+" "+this.userData.lastName;

      this.storageService.createUser(this.userData);
      console.log(this.userData);
    }
  }

  sendCheckGithubProfile(gitlink){
    this.validateClicked=true;
    //console.log(this.resumeFile);
    if(!gitlink.errors){
      var smallString=gitlink.value;
      gitlink.loading=true;
      this.httpClient.get("https:\/\/api.github.com/users/"+smallString.split("/")[3]).subscribe(
        data => {gitlink.badProfile=false; gitlink.profileData=gitlink.value; gitlink.loading=false;},
        error => {gitlink.badProfile=true; gitlink.profileData=gitlink.value; gitlink.loading=false;}
      );
    } else {
      gitlink.badProfile=true;
    }
  }


}
