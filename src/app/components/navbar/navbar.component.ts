import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../providers/login.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
role:string;
flag:boolean=false;
access:string[]=["team lead","process associate"];
  constructor(private router:Router,private loginService:LoginService) { }

  ngOnInit(): void {
this.role=sessionStorage.getItem('role');
console.log(`users role is ${this.role}`);
if(this.access.includes(this.role)){
  this.flag=true;
}
  }

    
logOut(){
  this.loginService.onLogOut();
  this.router.navigate(['']);
}

}
