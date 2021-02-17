import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public notValid: boolean = false;

  userForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  });
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }
  get userName() {
    return this.userForm.get('userName');
  }

  get password() {
    return this.userForm.get('password');
  }

onSubmit(){
  console.log(`submit button pressed`)


  console.log(this.userForm)

}


}
