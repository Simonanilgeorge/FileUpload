import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {


  form=this.fb.group({
    username:[sessionStorage.getItem('account_name')],
    currentPassword:[{value:"",disabled:false},Validators.required],
    newPassword:[{value:"",disabled:false},Validators.required],
    confirmPassword:[{value:"",disabled:false},Validators.required]
  })
  constructor(private fb:FormBuilder,private empReportService:EmpreportService) { }

  ngOnInit(): void {
  }


  get currentPassword(){
    return this.form.get("currentPassword")
  }

  get newPassword(){
    return this.form.get("newPassword")
  }

  get confirmPassword(){
    return this.form.get("confirmPassword")
  }

  submit(){
    console.log(this.form.getRawValue())
    // this.empReportService.resetPassword(this.form.getRawValue()).subscribe((res)=>{
    //   console.log("success")
    //   this.form.reset()
    // },(err)=>{
    //   console.log(err.message)
    // })
  
  }
}
