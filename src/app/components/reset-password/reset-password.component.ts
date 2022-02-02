import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  message = null;
  toast: Boolean = false;
  toastStatus
  form=this.fb.group({
    username:[sessionStorage.getItem('account_name')],
    currentPassword:[{value:"",disabled:false},Validators.required],
    newPassword:[{value:"",disabled:false},[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}') ] ],

    confirmPassword:[{value:"",disabled:false},Validators.required]
  })




  constructor(private fb:FormBuilder,private empReportService:EmpreportService,private loginService:LoginService) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    
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

    this.empReportService.resetPassword(this.form.getRawValue()).subscribe((res)=>{
      console.log(res)
      if(res.response=="Success"){
        this.showToastMessage("Password updated","success")
        this.form.reset()
      }
      else{

      this.showToastMessage("Invalid current password","error")
      }

    },(err)=>{
      console.log(err.message)
    })
  
  }
  showToastMessage(message, status) {
    this.message = message;
    this.toastStatus = `${status}`
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }

}
