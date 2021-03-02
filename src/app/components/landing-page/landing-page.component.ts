import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  user:String;
  constructor(private router:Router,private loginService:LoginService) { }

  ngOnInit(): void {
    let user;
    user=sessionStorage.getItem('user');
    
    if (user) {
      console.log(`The user currently logged in is ${user}`)
      this.user=user;
    }
    else {
      this.router.navigate(['']);
      console.log("Inside the else block")
      console.log(user)
    }

  }

  
logOut(){
  this.loginService.onLogOut();
  this.router.navigate(['']);
}

}
