import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service'
import { DatePipe } from '@angular/common';
import { ExportExcelService } from '../../providers/export-excel.service'
@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.css'],
  providers: [DatePipe]
})
export class ClientReportComponent implements OnInit {
  sheetList=["Revenue","Volume"]

  fileName="Client_Based_Monthly_Report.xlsx"
  data = [];
  flag: boolean = false;
  dates = [];
  searchedKeyword: string;
  columnSum={};
  total;

  Date = this.fb.group({
    date: [this.datePipe.transform(new Date(), "yyyy-MM"), Validators.required],
    sheetName: ['Revenue', Validators.required]
  })
  constructor(private loginService: LoginService, private fb: FormBuilder, private empReportService: EmpreportService, private datePipe: DatePipe,private exportExcelService: ExportExcelService) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole("ClientReportComponent")
    this.onSubmit()
  }

get sheetName(){
  return this.Date.get("sheetName")
}

  // function called when filter is changed
  onSubmit() {

    if (this.Date.status === "INVALID") {
      this.flag=true;
      this.data=[];
      return;
    }
    this.empReportService.getClientReport(this.Date.value).subscribe((res) => {

      res = JSON.parse(res);

      this.dates = res.dates;
      this.data = res.data;

      this.total = 0
      // initialize columnsum keys to 0
      this.dates.forEach((date) => {
        this.columnSum[date] = 0;
      })
      // check if value exist in data; get columnwise sum
      this.data.forEach(datas => {
        this.total = this.total + datas.total
        this.dates.forEach((date) => {
          if (datas[date]) {
            this.columnSum[date] = this.columnSum[date] + datas[date]
          }
        })

      });
    
      this.flag = true;
    }, (err) => {
      console.log(err.message);
    })
  }
  
  checkDay(date){
    if(new Date(date).getDay() == 0 || new Date(date).getDay() == 6)
    {
      return true
    }
    else{
      return false
    }
  }


      // export to excel file
      export() {
        /* table id is passed over here */
        let element = document.querySelector(".table-excel");
        this.exportExcelService.exportToExcel(element, this.fileName)
    
      }
}