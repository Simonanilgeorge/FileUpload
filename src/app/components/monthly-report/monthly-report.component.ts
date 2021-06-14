import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css'],
  providers:[DatePipe]
})
export class MonthlyReportComponent implements OnInit {
  flag: Boolean = false;
  titleName;
  message;
  total: any = 0
  toast: Boolean = false
  searchedKeyword: string;
  data = [];
  dates = [];
  sheetNameRes;
  SheetList = ["Revenue", "Productivity", "Utilization", "Orders"];

  Date = this.fb.group({
    date: [this.datePipe.transform(new Date(),"yyyy-MM"), Validators.required],
    sheetName: ['Revenue', Validators.required]
  })
  constructor(private loginService: LoginService, private fb: FormBuilder, private empReportService: EmpreportService,private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.filter()
  }

  get date() {
    return this.Date.get("date");
  }

  filter() {



    if (this.Date.status === "INVALID") {

      this.showToastMessage("Select month and sheet");
      return;
    }
    this.empReportService.getMonthlyReport(this.Date.value).subscribe((res) => {

      res = JSON.parse(res);
      this.data = res.data;
      this.dates = res.dates;
      this.sheetNameRes=res.sheet;
      this.total = 0
      this.data.forEach(datas => {
        this.total = this.total + datas.total 
      });
      this.flag = true
    }, (err) => {
      console.log(err.message)
    })
  }



  showToastMessage(message) {
    this.message = message;
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }

  getTitleName(title){

    this.titleName=null;
    setTimeout(()=>{
      this.titleName=title;
    },100)


  }

}