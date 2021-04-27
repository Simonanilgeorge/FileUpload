import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service'

@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.css']
})
export class ClientReportComponent implements OnInit {

data=[];
dates=[];
  Date=this.fb.group({
    date:['',Validators.required]
  })
  constructor(private loginService: LoginService, private fb: FormBuilder, private empReportService: EmpreportService) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
  }

  
  onSubmit(){
    console.log(this.Date.value);
    this.empReportService.getClientReport(this.Date.value).subscribe((res)=>{

      res=JSON.parse(res);
      this.dates=res.dates;
      this.data=res.data;
      console.log(res);
    },(err)=>{
      console.log(err.message);
    })
  }
}
