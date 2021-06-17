import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css'],
  providers:[DatePipe]
})
export class EmployeeReportComponent implements OnInit {

  datas: any;

  titleName;
  titles=[]
  flag = 2;
  searchedKeyword: string;
  showColumnInput;
  columnFilterForm=this.fb.group({
    empcode:[""],
    name: [""],
    doj: [""],
    search: [""],
    client: [""],
    task: [""]
  })
  filterForm = this.fb.group({
    dateFilter: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')]
  });
  constructor(private empreportService: EmpreportService, private fb: FormBuilder,private loginService:LoginService,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.getReport();

  }

  getReport() {


    this.empreportService.getReport().subscribe((res) => {
      this.onResponse(res);
    }, (err) => {
      console.log(err.message)
    })
  }

  onSubmit() {
    this.flag=2;
    this.empreportService.getReportByFilter(this.filterForm.value).subscribe((res) => {

      this.onResponse(res);
    }, (err) => {
      console.log(err.message);
    })

  }

  onResponse(res) {

    res = JSON.parse(res);

  
    this.datas = res;
    if (this.datas.length == 0) {
      this.flag = 0;
      return;
    }
    else {
      this.flag = 1;
      this.titles=res.map((data)=>{
        return Object.keys(data)
      })[0]
      this.titles.splice(6,4)    
      
    }


  }

  getTitleName(title){

    this.titleName=null;
    setTimeout(()=>{
      this.titleName=title;
    },100)


  }
  showInput(){
    this.showColumnInput = !this.showColumnInput
    
  }

}