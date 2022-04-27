import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  manager: Boolean
  employee: Boolean
  nav = []

  constructor(private loginService: LoginService) {


  }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();

    this.nav = CryptoJS.AES.decrypt(sessionStorage.getItem("role"),sessionStorage.getItem("token")).toString(CryptoJS.enc.Utf8).split(",")
    if(this.nav.includes("Super Admin")){
      this.nav = ["Production Reports","Client Reports","Admin","Super Admin"]
    }
  }


}
