import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../providers/login.service'
import { EmpreportService } from '../../providers/empreport.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  role: string;
  flag: boolean = false;
  nav=[]
  ClientList=[]

  constructor(private router: Router, private loginService: LoginService,private empReportService: EmpreportService) { }

  ngOnInit(): void {

    this.nav=CryptoJS.AES.decrypt(sessionStorage.getItem("role"),sessionStorage.getItem("token")).toString(CryptoJS.enc.Utf8).split(",")
    this.getDropDown()

    if(this.nav.includes("Super Admin")){
      this.nav = ["Production Reports","Client Reports","Admin","Super Admin"]
    }
  }
  logOut() {
    this.loginService.onLogOut();
    this.router.navigate(['']);
  }


    getDropDown() {
    this.empReportService.getDropDownList().subscribe((res) => {
      this.ClientList = res.Client;
    }, (err) => {
      console.log(err.message)
    })
  }
}
