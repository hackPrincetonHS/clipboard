import { Injectable } from '@angular/core';
import {firestore} from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from  '../auth/auth.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(public authService:  AuthService, public fs: AngularFirestore, public fireStorage: AngularFireStorage) { }

  async createUser(userData: UserData){
    await this.fs.collection("users").doc(this.authService.userUid).set({...userData});
  }
  get userInfoObservable() : Observable<UserData>{
    return this.fs.collection("users").doc<UserData>(this.authService.userUid).valueChanges();
  }
  uploadFile(upload: Upload) {
    const file = upload.file;
    const filePath = "resumes/"+this.authService.userUid;
    const ref = this.fireStorage.ref(filePath);
    const task = ref.put(file);
    upload.progress=task.percentageChanges();
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

export class Upload {
  progress: Observable<number>;
  file;
}
