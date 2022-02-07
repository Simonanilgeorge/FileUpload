import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';

import { EmpreportService } from '../../providers/empreport.service'
import { DatePipe } from '@angular/common';
import { ExportExcelService } from '../../providers/export-excel.service'
import {ColumnsortPipe} from '../../pipes/columnsort.pipe'
@Component({
  selector: 'app-yearly-employee-report',
  templateUrl: './yearly-employee-report.component.html',
  styleUrls: ['./yearly-employee-report.component.css'],
  providers: [DatePipe,ColumnsortPipe]
})
export class YearlyEmployeeReportComponent implements OnInit {

  searchedItems
  fileName = "yearly_employee_report.xlsx"
  flag = 2;
  dropDownList
  ClientList=[]
  titleName;
  message;
  toastStatus
  total: any = 0
  columnSum = {};
  toast: Boolean = false
  searchedKeyword: string;
  data = [];
  dates = [];
  titles = ["empcode", "name", "doj", "search", "client", "task"];
  headings = {
    "empcode": "Employee code",
    "name": "Employee name",
    "doj": "Date of Joining",
    "search": "Search/Non-Search",
    "client": "Client",
    "task": "Task"
  }

  sheetNameRes;
  SheetList = ["Revenue", "Productivity", "Utilization", "Orders"];
  showColumnInput;
  columnFilterForm: FormGroup = this.fb.group({
    empcode: [""],
    name: [""],
    doj: [""],
    search: [""],
    client: [""],
    task: [""]
  })
  Date = this.fb.group({
    date: [this.datePipe.transform(new Date(), "yyyy"), Validators.required],
    sheetName: ['Revenue', Validators.required]
  })

  constructor(private loginService: LoginService, private fb: FormBuilder, private empReportService: EmpreportService, private datePipe: DatePipe, private exportExcelService: ExportExcelService,private columnSortPipe:ColumnsortPipe) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole("YearlyEmployeeReportComponent")
    this.getDropDown()
  }

  get date() {
    return this.Date.get("date");
  }


  // function called on ngOnInit()
  filter() {
    this.flag = 2;

    if (this.date.status === "INVALID") {
      this.flag = 0;
      this.showToastMessage("Select a year","warning");
      return;
    }

    // check date input length
    if (this.date.value.toString().length != 4) {
      // this.showToastMessage("Select a valid year");
      this.flag = 0;
      return
    }


    this.empReportService.getYearlyEmployeeReport(this.Date.value).subscribe((res) => {

      res = JSON.parse(res);
  
      this.data = res.data;
      this.dates = res.dates;

      this.sheetNameRes = res.sheet;

      this.total = 0
      // initialize columnsum keys to 0
      this.dates.forEach((date) => {
        this.columnSum[date] = 0;
      })

      // check if value exist in data
      this.data.forEach(datas => {
        this.total = this.total + datas.total
        this.dates.forEach((date) => {
          if (datas[date]) {
            this.columnSum[date] = this.columnSum[date] + datas[date]
          }
        })

      });

      if (this.total == 0 && this.data.length != 0) {

        this.flag = 0;
      }
      else {
        this.flag = 1;
      }
    }, (err) => {
      console.log(err.message)
    })
  }

  showToastMessage(message,status) {
    this.message = message;
    this.toast = true;
    this.toastStatus=`${status}`
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }

  getTitleName(title) {

    this.titleName = null;
    setTimeout(() => {
      this.titleName = title;
    }, 100)
  }

  // showInput(){
  //   this.showColumnInput = !this.showColumnInput

  // }

  // export to excel file
  export() {
    /* table id is passed over here */
    let element = document.querySelector(".table-excel");
    this.exportExcelService.exportToExcel(element, this.fileName)

  }
  public searchItems() {


    this.searchedItems = this.columnSortPipe.transform(this.data,this.columnFilterForm.value);

   return this.searchedItems;
}


getDropDown() {

  this.empReportService.getDropDownList().subscribe((res) => {

    this.dropDownList = res;

    this.ClientList = this.dropDownList.Client;
    this.filter()

  }, (err) => {
    console.log(err.message)
  })
}

}