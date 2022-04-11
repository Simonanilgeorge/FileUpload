import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';

import { EmpreportService } from '../../providers/empreport.service'
import { DatePipe } from '@angular/common';
import { ExportExcelService } from '../../providers/export-excel.service'
import {ColumnsortPipe} from '../../pipes/columnsort.pipe'
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-yearly-employee-report',
  templateUrl: './yearly-employee-report.component.html',
  styleUrls: ['./yearly-employee-report.component.css'],
  providers: [DatePipe,ColumnsortPipe]
})
export class YearlyEmployeeReportComponent implements OnInit {

  role
  searchedItems
  fileName = "Yearly_Production_Report.xlsx"
  flag = 2;
  dropDownList
  ClientList=[]
  Tasklist=[]
  Processlist=[]
  final
  dropDownFilters=["client","search","task","process"];
  titleName;
  message;
  toastStatus
  total: any = 0
  columnSum = {};
  toast: Boolean = false
  searchedKeyword: string;
  data = [];
  dates = [];
  titles = ["empcode", "name", "doj", "search", "client", "task","process","state"];
  headings = {
    "empcode": "Employee code",
    "name": "Employee name",
    "doj": "Date of Joining",
    "search": "Search/Non-Search",
    "client": "Client",
    "task": "Task",
    "process":"Process",
    "state":"State"
  }

  sheetNameRes;
  SheetList = ["Productivity", "Utilization", "Orders"];
  showColumnInput;
  columnFilterForm: FormGroup = this.fb.group({
    empcode: [""],
    name: [""],
    doj: [""],
    search: [""],
    client: [""],
    task: [""],
    process:[""],
    state:[""]
  })
  Date = this.fb.group({
    date: [this.datePipe.transform(new Date(), "yyyy"), Validators.required],
    sheetName: ['Productivity', Validators.required]
  })

  constructor(private loginService: LoginService, private fb: FormBuilder, private empReportService: EmpreportService, private datePipe: DatePipe, private exportExcelService: ExportExcelService,private columnSortPipe:ColumnsortPipe) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.role=sessionStorage.getItem("role").split(",")
    this.loginService.navigateByRole("YearlyEmployeeReportComponent")
    this.getDropDown()
  }

  get task(){
    return this.columnFilterForm.get("task")
  }

  get process(){
    return this.columnFilterForm.get("process")
  }

  get client(){
    return this.columnFilterForm.get("client")
  }
  get date() {
    return this.Date.get("date");
  }

  titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  }


  changeClientOptions() {

    this.task.setValue("")
    this.process.setValue("")

    this.Tasklist = this.dropDownList[this.client.value];

    this.Processlist = []
  }
  // function called when task value is changed
  changeTaskOptions() {
    if(this.task.value==""){
      this.Processlist=[]   
    }
    else{
      this.final = null
      this.process.setValue("");
      this.final = this.client.value + this.task.value
      this.Processlist = this.dropDownList[this.final]
    }

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
    // / table id is passed over here /
    let element = document.querySelector(".table-excel");
    var Heading = [];  
        this.titles.forEach(element => {
          Heading.push(this.titleCase(this.headings[element]))
        });
        
        this.dates.forEach(date => {
          Heading.push(date)
        });

        if(this.sheetNameRes=='Revenue'||this.sheetNameRes=='Orders'){
          Heading.push("Total")
        }
      
        const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element,{dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});
        
        // / generate workbook and add the worksheet /
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        XLSX.utils.sheet_add_aoa(ws, [Heading], {origin:"A2"}); 
        // / save to file /
        ws['!rows'][0] = { hidden: true };
        XLSX.writeFile(wb, this.fileName);

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