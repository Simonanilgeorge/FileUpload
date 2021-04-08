import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder} from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import {EmpreportService} from '../../providers/empreport.service'


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  constructor(private loginService: LoginService,private empreportService:EmpreportService,private fb:FormBuilder) {

  }

  user:FormGroup
  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.user=this.fb.group({
      account_name:sessionStorage.getItem('account_name'),
      dateFilter:['']
    })
    this.getStatus();

  }

  getStatus() {

    console.log(this.user.value);
    this.empreportService.getMyStatus(this.user.value).subscribe((res)=>{
      console.log(res);
    },(err)=>{
      console.log(err.message);
    })
  }

}
