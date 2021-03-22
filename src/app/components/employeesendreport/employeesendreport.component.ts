import { Component, OnInit } from '@angular/core';

import { Validators,FormBuilder,FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {EmpreportService} from '../../providers/empreport.service';


@Component({
  selector: 'app-employeesendreport',
  templateUrl: './employeesendreport.component.html',
  styleUrls: ['./employeesendreport.component.css']
})
export class EmployeesendreportComponent implements OnInit {


  public notValid: boolean = false;
  flag=true;
  userForm = this.fb.group({

    username:sessionStorage.getItem('user'),
    account_name:sessionStorage.getItem('account_name'),
    status:['', Validators.required]

  });
  constructor(private fb: FormBuilder,private empReportService: EmpreportService,private router:Router) { }

  ngOnInit(): void {
  }

get status() {
  return this.userForm.get('status');
}



onSubmit() {
console.log("testing")
console.log(this.userForm.value);

this.empReportService.sendReport(this.userForm.value).subscribe((res)=>{

  this.flag=false;
  console.log(this.flag);
  console.log(res);
  setTimeout(()=>{
this.router.navigate(['/home']);
  },1000);
},(err)=>{
  console.log(err.message)
})

}
}
