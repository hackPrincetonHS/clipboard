import { Injectable } from '@angular/core'
import { Router } from  "@angular/router";

import {firestore} from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from  '../auth/auth.service';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(public authService:  AuthService, public fs: AngularFirestore, public fireStorage: AngularFireStorage, public router: Router) { }

  async createUser(userData: UserData){
    //the ... is to unpack user data into a dictionary. It's an angular thing, don't ask me.
    await this.fs.collection("users").doc(this.authService.userUid).set({...userData});
    this.router.navigate(['dashboard']);
  }
  get userInfoObservable() : Observable<UserData>{
    return this.fs.collection("users").doc<UserData>(this.authService.userUid).valueChanges();
  }
  
  // upload resume
  uploadFile(upload: Upload, extension: string) {
    const file = upload.file;
    const filePath = extension + "/" + this.authService.userUid;
    const ref = this.fireStorage.ref(filePath);
    const task = ref.put(file);
    upload.progress=task.percentageChanges();
  }
  
  // delete resume
  deleteResume() {
    return this.fireStorage.ref("resumes/"+this.authService.userUid).delete();
  }
  
  // fetch resume
  get resumeLink() : Observable<String>{
    return this.fireStorage.ref("resumes/"+this.authService.userUid).getDownloadURL();
  }
  
  // fetch vaccination
  get vaccinationLink() : Observable<String>{
    console.log("works");
    return this.fireStorage.ref("vaccinationCards/" + this.authService.userUid).getDownloadURL();
  }  

}

@Injectable()
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
  satisfaction : number;
  latino: boolean;
  questionsComments : string;
  isFullyLoggedIn : boolean;

  hasResume : boolean;
  // checking if has vaccination
  hasVaccination: boolean;

  street1 : string;
  street2 : string;
  city : string;
  state : string;
  zip5 : string;
  zip4 : string;
  deliveryPoint : string;
  dateCreated : firestore.Timestamp;
}

@Injectable()
export class Upload {
  progress: Observable<number>;
  file;
}
