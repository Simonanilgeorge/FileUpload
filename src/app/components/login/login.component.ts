import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../providers/login.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public notValid: boolean = false;
  noAccess: boolean = false;
  flag=0;
loginFlag=false
  userForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {

  }
  get username() {
    return this.userForm.get('username');
  }

  get password() {
    return this.userForm.get('password');
  }

  onSubmit() {
    this.username.setValue(this.username.value.trim())
    this.loginFlag=true
    if(this.userForm.invalid){

      return
    }
    this.flag=1;

    this.loginService.login(this.userForm.value).subscribe((res) => {
      this.loginFlag=false

      if (res.login == "success") {

        this.router.navigate(['home'])
        this.notValid = false
        this.noAccess = false


        // this.getRole(res.name,res.account_name)
        this.loginService.saveUsername(res.name, res.description, res.account_name)
      


      }

      else if (res.login == "Contact Manager")
      {
        this.flag=0;
          console.log("Contact your manager")
      }


      else {
        this.notValid = true
        this.flag=0;
      }


    }, (err) => {
      this.flag=0;
      console.log(err.message)
    })


  }

// get role for the current user
  // getRole(name,accountName){
  //   this.loginService.getRole(name).subscribe((res)=>{
  //     console.log(res)

  // response will return the role of the current user
  // this.loginService.saveUsername(name,res.description,accountName)
  //   },(err)=>{
  //     console.log(err.message)
  //   })
  // }

}
