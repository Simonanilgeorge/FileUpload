import { Component, OnInit } from '@angular/core';

import { Validators,FormBuilder,FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {EmpreportService} from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
@Component({
  selector: 'app-employeesendreport',
  templateUrl: './employeesendreport.component.html',
  styleUrls: ['./employeesendreport.component.css']
})
export class EmployeesendreportComponent implements OnInit {


  public notValid: boolean = false;
  flag=true;
  myForm = this.fb.group({
    inputs: this.fb.array([]),
    username:sessionStorage.getItem('user'),
    account_name:sessionStorage.getItem('account_name')

  });

  constructor(private fb: FormBuilder,private empReportService: EmpreportService,private router:Router,private loginService:LoginService) { }

  ngOnInit(): void {
    
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name) 
    this.addInput();
  
  }

// add new input fields
addInput() {
  this.inputs.push(
    this.fb.group({
      orderNumber: ["",Validators.required],
      status:["Completed"],
      comments: [""]
    })
  );
}
// remove input fields
removeInput(i: number) {
  this.inputs.removeAt(i);
  this.inputs.updateValueAndValidity();
  this.myForm.updateValueAndValidity();
}

get inputs() {
  return this.myForm.get("inputs") as FormArray;
}






onSubmit() {
this.empReportService.sendReport(this.myForm.value).subscribe((res)=>{
  this.flag=false;
  setTimeout(()=>{
this.router.navigate(['/home']);
  },1000);
},(err)=>{
  console.log(err.message)
})
}



}
