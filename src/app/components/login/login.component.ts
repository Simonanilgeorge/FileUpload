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

    this.flag=1;
    this.username.setValue(this.username.value.trim())
    this.loginService.login(this.userForm.value).subscribe((res) => {

      console.log(res)
      if (res.login == "success") {

        this.router.navigate(['home'])
        this.notValid = false
        this.noAccess = false
        this.loginService.saveUsername(res.name, res.description, res.account_name)
      


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


}
