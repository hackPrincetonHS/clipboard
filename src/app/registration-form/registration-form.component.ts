import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';



@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  page=1;
  numPages=3;
  attemptSubmit=false;

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

  githubLink;

  githubLinkInput;

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


  constructor(private cdr: ChangeDetectorRef, private httpClient: HttpClient) { }

  ngOnInit() {
    this.haveGithub="No";
    this.haveResume="No"
  }

  nextPage() {
    this.page+=1;
  }
  prevPage() {
    this.page-=1;
  }
  submitting() {
    this.attemptSubmit=true;
    this.cdr.detectChanges();
    console.log(document.getElementsByClassName("alert").length)
  }
  autoTab(event, nextInput) {
    const getMethods = (obj) => {
      let properties = new Set()
      let currentObj = obj
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
    let month=monthObj.value
    let day=dayObj.value
    let year=yearObj.value
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
  checkGithubProfile(gitlink){

    if(!gitlink.errors){
      console.log("got here")
      var smallString=gitlink.value
      gitlink.loading=true
      this.httpClient.get("https:\/\/api.github.com/users/"+smallString.split("/")[3]).subscribe(
        data => {gitlink.badProfile=false; gitlink.profileData=gitlink.value; gitlink.loading=false;},
        error => {gitlink.badProfile=true; gitlink.profileData=gitlink.value; gitlink.loading=false;}
      );
    } else {
      gitlink.badProfile=true
    }
  }

}
