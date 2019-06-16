import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  page=1
  numPages=3

  constructor() { }

  ngOnInit() {
  }

  nextPage(){
    this.page+=1
  }
  prevPage(){
    this.page-=1
  }
  submiting(){
    //todo
  }

}
