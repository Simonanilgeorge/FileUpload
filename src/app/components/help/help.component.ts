import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

 manager:Boolean
 employee:Boolean 


  constructor(private loginService:LoginService) { 


  }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    [this.employee,this.manager]=this.loginService.checkRole();

  }
  

}
