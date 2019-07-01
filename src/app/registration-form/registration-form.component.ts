import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as lodash from 'lodash'
import { catchError } from 'rxjs/operators';
import { AuthService } from  '../auth/auth.service';
import { StorageService, UserData, Upload } from '../storage/storage.service';
import {firestore} from 'firebase/app';


@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  page=1;
  numPages=3;
  attemptNext=false;

  needGithubLink=false;
  needResume=false;

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
  usingHardware;
  githubLinkInput;
  hardwareInput;
  hardwareInputText;
  termsDataSharing;
  termsCodeOfConduct;
  satisfactionRange;
  questionsComments;

  resumeFile;

  uploadPercentage;

  checkGithubProfile;
  schoolList=[
    ["Milburn High School"],
    ["Montgomery High School"],
    ["Bergen County Academies"],
    ["Princeton High School", "PHS"],
    ["Freehold High School"],
    ["Robbinsville High School"],
    ["HightsTown High School"],
    ["Stuyvesant High School"],
    ["East Stroudsburg High School"],
    ["Livingston High School"],
    ["Princeton Day School", "PDS"],
    ["Noor-ul-Iman", "Noor ul Iman"],
    ["Wardlaw + Hartridge School"],
    ["South Brunswick High School"],
    ["Ridge High School"],
    ["West Windsor Plainsborough High North", "WWP", "North"],
    ["West Windsor Plainsborough High South", "WWP", "South"],
    ["Middlesex County Academy"],
    ["Perth Amboy Vocational Technical School"],
    ["Raritan High School"],
    ["Pennington School"],
    ["Manav Rachna International"],
    ["Edison Academy"],
    ["Port Credit Secondary School"],
    ["John P. Stevens High School", "J.P. Stevens"]
  ];

  hardwareList=[
    ["Servos"],
    ["Motors"],
    ["Arduino or other microcontrollers", "ESP", "ESP-32"]
  ]

  constructor(private cdr: ChangeDetectorRef, private httpClient: HttpClient, public authService:  AuthService, public userData: UserData, public storageService: StorageService, public upload: Upload) { }

  ngOnInit() {
    this.haveGithub="No";
    this.haveResume="No";
    this.usingHardware="No";
    this.checkGithubProfile=lodash.throttle(this.sendCheckGithubProfile, 2000);
  }

  ngAfterContentChecked() {
    //have to cast to any or it won't compile
    //this is the only working way to do it on stackoverflow, so it's the only solution
    (<any>document.getElementsByTagName('select')).selectpicker();
  }

  nextPage() {
    if(this.checkPage()){
      this.attemptNext=false;
      this.page+=1;
    }
  }

  prevPage() {
    this.attemptNext=true;
    this.page-=1;
  }
  checkPage() {
    this.attemptNext=true;
    this.cdr.detectChanges();
    //console.log(document.getElementsByClassName("alert"))
    return document.getElementsByClassName("alert").length==0;
  }
  submitting(optional) {
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
  }
  submittingWithFile(){
    this.upload.file=this.resumeFile
    this.storageService.uploadFile(this.upload);
    this.upload.progress.subscribe((x: number) => {
      this.uploadPercentage=x;
      if(this.uploadPercentage==100){
        //you want it to complete before moving on, otherwise it calls too quickly and the bar is only half full when it stops.
        //looks better, feels better. I use lodash instead of settimeout because I already use lodash in another part of the class so like...
        //this has to be passed  because it becomes an anon function. This is delt with later in the submitting funciton
        lodash.delay(this.restOfSubmitting, 1000,this);
      }
    });
    //this.submitting(dict);
  }
  restOfSubmitting(optional){
    (<any>document.getElementById('modal')).modal('toggle');
    optional.submitting(optional);
  }
  autoTab(event, nextInput) {
    const getMethods = (obj) => {
      let properties = new Set();
      let currentObj = obj;
      do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
      } while ((currentObj = Object.getPrototypeOf(currentObj)))
      return [...properties.keys()].filter(item => typeof obj[item] === 'function')
    }
    let input = event.target;
    let length = input.value.length;
    let maxLength = input.attributes.maxlength.value;
    if (length >= maxLength) {
      document.getElementById(nextInput).focus();
    }
  }
  validateDate(monthObj,dayObj,yearObj) {
    let month=monthObj.value;
    let day=dayObj.value;
    let year=yearObj.value;
    if(month && day && year){
      var mom=moment(year+"-"+month+"-"+day, "YYYY-MM-DD")
      return  mom.isValid() && mom.year()>1900 && mom.isBefore(moment());
    }
    //one of the fields is empty, so we ignore it
    return true
  }
  setRadio(dom, set) {
    dom.value=set;
  }
  sendCheckGithubProfile(gitlink){
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
