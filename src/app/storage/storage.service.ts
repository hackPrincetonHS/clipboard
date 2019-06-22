import { Injectable } from '@angular/core';
import {firestore} from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(public fs: AngularFirestore) { }

  async createUser(userData: UserData){
    await this.fs.collection("users").add({...userData});
  }
}

export class UserData {
  uid : string;
  firstName : string;
  lastName : string;
  fullName : string;
  phone : string;
  dateOfBirth : string;
  gender : string;
  ethnicity : string;
  schoolNotInList : boolean;
  school : string;
  studyLevel : string;
  graduationYear : string;
  specialAccomadations : string;
  shirtSize : string;
  dietaryRestrictions : string;
  githubLink : string;
  hardware : string;
  hardwareOther : string;
  satisfaction : number;
  questionsComments : string;
  isFullyLoggedIn : boolean;
  dateCreated : firestore.Timestamp;
}
