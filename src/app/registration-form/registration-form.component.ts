import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as lodash from 'lodash'
 import * as bootstrap from "bootstrap";
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
    (<any>$('select')).selectpicker();
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
  submitting(maybe) {
    var schtuff;
    if(this){
      schtuff=this;
    } else {
      schtuff=maybe;
    }
    //convert to truthy/falsy (not not)
    schtuff.userData.hasResume=!!schtuff.resumeFile;

    schtuff.userData.isFullyLoggedIn=true;
    schtuff.userData.uid=schtuff.authService.userUid;
    schtuff.userData.firstName=schtuff.inputFirstName;
    schtuff.userData.lastName=schtuff.inputLastName;
    schtuff.userData.fullName=schtuff.inputFirstName+" "+schtuff.inputLastName;
    schtuff.userData.phone=schtuff.inputPhone1+"-"+schtuff.inputPhone2+"-"+schtuff.inputPhone3;
    schtuff.userData.dateOfBirth=schtuff.inputYear+"-"+schtuff.inputMonth+"-"+schtuff.inputDay;
    schtuff.userData.gender=schtuff.pickGender;
    schtuff.userData.ethnicity=schtuff.ethnicity;
    if(schtuff.schoolInputText) {
      schtuff.userData.school=schtuff.schoolInputText;
      schtuff.userData.schoolNotInList=true;
    } else {
      schtuff.userData.school=schtuff.schoolInput;
      schtuff.userData.schoolNotInList=false;
    }
    schtuff.userData.studyLevel=schtuff.studyLevel;
    schtuff.userData.graduationYear=schtuff.graduationYear;
    schtuff.userData.specialAccomadations=schtuff.specialAccomadations;
    schtuff.userData.shirtSize=schtuff.shirtSize;
    schtuff.userData.dietaryRestrictions=schtuff.dietaryRestrictions;
    schtuff.userData.githubLink=schtuff.githubLinkInput;
    schtuff.userData.hardware=schtuff.hardwareInput;
    schtuff.userData.hardwareOther=schtuff.hardwareInputText;
    if(schtuff.satisfactionRange===undefined){
      schtuff.userData.satisfaction=50;
    } else {
      schtuff.userData.satisfaction=schtuff.satisfactionRange;
    }
    schtuff.userData.questionsComments=schtuff.questionsComments;
    schtuff.userData.dateCreated=firestore.Timestamp.fromDate(new Date());
    for (var property in schtuff.userData) {
      if (schtuff.userData.hasOwnProperty(property)) {
        if(schtuff.userData[property]===undefined){
          schtuff.userData[property]="";
        }
      }
    }
    //console.log(schtuff.userData);
    schtuff.storageService.createUser(schtuff.userData);
  }
  submittingWithFile(){
    this.upload.file=this.resumeFile
    this.storageService.uploadFile(this.upload);
    this.upload.progress.subscribe((x: number) => {
      this.uploadPercentage=x;
      if(this.uploadPercentage==100){
        //you want it to complete before moving on, otherwise it calls too quickly and the bar is only half full when it stops.
        //looks better, feels better
        lodash.delay(this.restOfSubmitting, 1000,this);
      }
    });
    //this.submitting(dict);
  }
  restOfSubmitting(maybe){
    $('#modal').modal('toggle');
    maybe.submitting(maybe);
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
