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
  // userForm = this.fb.group({

  //   username:sessionStorage.getItem('user'),
  //   account_name:sessionStorage.getItem('account_name'),
  //   status:['', Validators.required]

  // });
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
addInput({ name, age, height }: any = {}) {
  this.inputs.push(
    this.fb.group({
      name: [name, []],
      age: [age, []],
      height: [height, []]
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

onSubmit(){

  console.log(JSON.stringify(this.myForm.value));
}


// get status() {
//   return this.userForm.get('status');
// }



// onSubmit() {



// this.empReportService.sendReport(this.userForm.value).subscribe((res)=>{

//   this.flag=false;


//   setTimeout(()=>{
// this.router.navigate(['/home']);
//   },1000);
// },(err)=>{
//   console.log(err.message)
// })

// }



}
