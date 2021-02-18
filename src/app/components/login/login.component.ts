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
    console.log(`submit button pressed`)


    console.log(this.userForm.controls.username.value)
    this.loginService.login(this.userForm.value).subscribe((res) => {
      console.log(res)

      console.log(res.login)
      if (res.login =="success") {
        this.router.navigate(['home'])
        this.notValid=false
        this.loginService.saveUsername(this.userForm.controls.username.value)
      }

      else{
        this.notValid=true
      }


    }, (err) => {
      console.log(err.message)
    })


  }


}
