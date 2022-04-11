
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { Location } from '@angular/common';

@Component({
  selector: 'app-target-table',
  templateUrl: './target-table.component.html',
  styleUrls: ['./target-table.component.css']
})
export class TargetTableComponent implements OnInit {
flag=2;
data=[]
titles:string[]=[]

headings={
  "Client":"Client",
  "Task":"Task",
  "Process":"Process",
  "Time":"Time",
  "band1":"Band 1",
  "band2":"Band 2",
  "band3":"Band 3",
  "price":"Price"
}

  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute, private elem: ElementRef, private location: Location) { }
  
  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole("TargetTableComponent")
    this.route.params.subscribe( params => {
      this.getTargetTable(params.client)
    });

  }

  getTargetTable(client){
    this.empReportService.getTargetTable(client).subscribe((res)=>{

      this.data=res
      this.flag=1;
      // populate titles 
      this.titles=Object.keys(res[0]).filter((element)=>{
        return element!="id"
      })

    },(err)=>{
      console.log(err.message)
    })
  }


  

}
