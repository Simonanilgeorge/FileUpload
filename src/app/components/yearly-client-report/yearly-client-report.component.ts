import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import { DatePipe } from '@angular/common';
import { ExportExcelService } from '../../providers/export-excel.service'
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-yearly-client-report',
  templateUrl: './yearly-client-report.component.html',
  styleUrls: ['./yearly-client-report.component.css'],
  providers: [DatePipe]
})
export class YearlyClientReportComponent implements OnInit {

  fileName="Yearly_Client_Report.xlsx"
  role
  data=[]
  flag=2;
  dates = [];
  sheetNameRes;
  searchedKeyword: string;
  titles=["client"];
  columnSum = {};
  total: any = 0
  message
  toastStatus
  toast
  SheetList = ["Volume"];

  filterForm = this.fb.group({
    date: [this.datePipe.transform(new Date(),"yyyy"), Validators.required],
    sheetName: ['Volume', Validators.required]

  });

  constructor(private empreportService: EmpreportService, private fb: FormBuilder, private loginService: LoginService, private datePipe: DatePipe, private route: ActivatedRoute, private router: Router,private exportExcelService: ExportExcelService) { }



  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.role=CryptoJS.AES.decrypt(sessionStorage.getItem("role"),sessionStorage.getItem("token")).toString(CryptoJS.enc.Utf8).split(",")
    this.loginService.navigateByRole("YearlyClientReportComponent")
    this.onSubmit()

  }



  get date() {
    return this.filterForm.get("date")
  }

  get sheetName() {
    return this.filterForm.get("sheetName")
  }

  onSubmit() {

    this.flag=2;

    if (this.date.status === "INVALID") {
      this.flag=0;
      this.showToastMessage("Select a year","warning");
      return;
    }

    // check date input length
    if(this.date.value.toString().length!=4){
      // this.showToastMessage("Select a valid year");
      this.flag=0;
      return
    }


    this.empreportService.getYearlyClientReport(this.filterForm.value).subscribe((res) => {


      res = JSON.parse(res);

      this.data = res.data;
      this.dates = res.dates;

      this.sheetNameRes=res.sheet;

      this.total = 0
      // initialize columnsum keys to 0
      this.dates.forEach((date)=>{
        this.columnSum[date]=0;
      })

      // check if value exist in data
      this.data.forEach(datas => {
        this.total = this.total + datas.total
        this.dates.forEach((date)=>{
          if(datas[date]){
            this.columnSum[date]=this.columnSum[date]+datas[date]
          }
        })

      });
      if(this.data.length!=0){
        this.flag=1;
      }
    else{
      this.flag=0;
    }


    }, (err) => {
      console.log(err.message)
    })
  }


  showToastMessage(message,status) {

    this.message = message;
    this.toastStatus=`${status}`
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }

  export() {
    /* table id is passed over here */
    let element = document.querySelector(".table-excel");
    this.exportExcelService.exportToExcel(element, this.fileName)

  }

}