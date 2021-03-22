import { Component, OnInit } from '@angular/core';

import { Validators,FormBuilder,FormArray } from '@angular/forms';
import { LoginService } from '../../providers/login.service'


@Component({
  selector: 'app-employeesendreport',
  templateUrl: './employeesendreport.component.html',
  styleUrls: ['./employeesendreport.component.css']
})
export class EmployeesendreportComponent implements OnInit {


  public notValid: boolean = false;

  userForm = this.fb.group({
    username:sessionStorage.getItem('user'),
    status:['', Validators.required]

  });
  constructor(private fb: FormBuilder,private loginService: LoginService) { }

  ngOnInit(): void {
  }

get status() {
  return this.userForm.get('status');
}



onSubmit() {
console.log("testing")
console.log(this.userForm.value);
}
}
