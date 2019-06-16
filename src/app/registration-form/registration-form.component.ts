import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  page=1
  numPages=3

  stu=20

  constructor() { }

  ngOnInit() {
  }

  calculatePercentage(){
    return this.page/this.numPages
  }

}
