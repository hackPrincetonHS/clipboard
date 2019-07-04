import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { StorageService, UserData } from '../storage/storage.service';
import { Router } from  "@angular/router";
import * as moment from 'moment';
import * as lodash from 'lodash';
import Utils from '../utils/utils';
import { HttpClient } from '@angular/common/http';


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

  constructor(private cdr: ChangeDetectorRef, private httpClient: HttpClient, public authService:  AuthService, public userData: UserData, public storageService: StorageService) { }

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

  submitting(optional) {
    this.dietaryRestrictions=this.userData.dietaryRestrictions;
    if(this.checkPage()){
      console.log("passed");
      return;
    }
    /*
    var self;
    if(this){
      self=this;
    } else {
      self=optional;
    }
    //convert to truthy/falsy (not not)
    self.userData.hasResume=!!self.resumeFile;

    self.userData.isFullyLoggedIn=true;
    self.userData.uid=self.authService.userUid;
    self.userData.firstName=self.inputFirstName;
    self.userData.lastName=self.inputLastName;
    self.userData.fullName=self.inputFirstName+" "+self.inputLastName;
    self.userData.phone=self.inputPhone1+"-"+self.inputPhone2+"-"+self.inputPhone3;
    self.userData.dateOfBirth=self.inputYear+"-"+self.inputMonth+"-"+self.inputDay;
    self.userData.gender=self.pickGender;
    self.userData.ethnicity=self.ethnicity;
    if(self.schoolInputText) {
      self.userData.school=self.schoolInputText;
      self.userData.schoolNotInList=true;
    } else {
      self.userData.school=self.schoolInput;
      self.userData.schoolNotInList=false;
    }
    self.userData.studyLevel=self.studyLevel;
    self.userData.graduationYear=self.graduationYear;
    self.userData.specialAccomadations=self.specialAccomadations;
    self.userData.shirtSize=self.shirtSize;
    self.userData.dietaryRestrictions=self.dietaryRestrictions;
    self.userData.githubLink=self.githubLinkInput;
    self.userData.hardware=self.hardwareInput;
    self.userData.hardwareOther=self.hardwareInputText;
    if(self.satisfactionRange===undefined){
      self.userData.satisfaction=50;
    } else {
      self.userData.satisfaction=self.satisfactionRange;
    }
    self.userData.questionsComments=self.questionsComments;
    self.userData.dateCreated=firestore.Timestamp.fromDate(new Date());
    for (var property in self.userData) {
      if (self.userData.hasOwnProperty(property)) {
        if(self.userData[property]===undefined){
          self.userData[property]="";
        }
      }
    }
    //console.log(self.userData);
    self.storageService.createUser(self.userData);
    */
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
