import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../providers/login.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  role: string;
  flag: boolean = false;
  employee:boolean
  manager:boolean
 
  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {

    [this.employee,this.manager]=this.loginService.checkRole();

  }


  logOut() {
    this.loginService.onLogOut();
    this.router.navigate(['']);
  }

}

