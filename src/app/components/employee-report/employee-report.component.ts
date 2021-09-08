import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import { DatePipe } from '@angular/common';
import { ExportExcelService } from '../../providers/export-excel.service'
import {ColumnsortPipe} from '../../pipes/columnsort.pipe'


@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css'],
  providers: [DatePipe,ColumnsortPipe]
})
export class EmployeeReportComponent implements OnInit {

  searchedItems
  // Daily Production report
  fileName="daily_production_report.xlsx"

  datas: any;
  titleName;

  sheetName="Revenue";
  titles = ["empcode", "name", "doj", "search", "client", "task"];
  headings = {
    "empcode": "Employee code",
    "name": "Employee name",
    "doj": "Date of Joining",
    "search": "Search/Non-Search",
    "client":"Client",
    "task": "Task"
  }
  
  SheetList = ["Revenue", "Productivity", "Utilization", "Orders"];
  flag = 2;
  searchedKeyword: string;
  showColumnInput;
  columnFilterForm = this.fb.group({
    empcode: [""],
    name: [""],
    doj: [""],
    search: [""],
    client: [""],
    task: [""]
  })


  filterForm = this.fb.group({
    dateFilter: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
    startDate: [""],
    endDate: [""]
  });
  constructor(private empreportService: EmpreportService, private fb: FormBuilder, private loginService: LoginService, private datePipe: DatePipe,private route: ActivatedRoute,private router: Router,private exportExcelService: ExportExcelService,private columnSortPipe:ColumnsortPipe) { }

  ngOnInit(): void {

    this.getReport();
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
  
  }

// get daily production report(called initially with no date)
  getReport() {
    this.empreportService.getReport().subscribe((res) => {
      this.onResponse(res);
    }, (err) => {
      console.log(err.message)
    })
  }


  //call this function with filter form values
  onSubmit() {
    this.flag = 2;
    this.empreportService.getReportByFilter(this.filterForm.value).subscribe((res) => {

      this.onResponse(res);
    }, (err) => {
      console.log(err.message);
    })

  }



  // function called on response 
  onResponse(res) {

    res = JSON.parse(res);
    this.datas = res;
    if (this.datas.length == 0) {
      this.flag = 0;
      return;
    }
    else {
      this.flag = 1;
    }


  }

  // reset titlename for sort(ascending descending)
  getTitleName(title) {

    this.titleName = null;
    setTimeout(() => {
      this.titleName = title;
    }, 100)


  }

  // column filter on double click
  // showInput() {
  //   this.showColumnInput = !this.showColumnInput

  // }


    // export to excel file
  export() {
    /* table id is passed over here */
    let element = document.querySelector(".table-excel");
    this.exportExcelService.exportToExcel(element, this.fileName)

  }
  public searchItems() {


    this.searchedItems = this.columnSortPipe.transform(this.datas,this.columnFilterForm.value);

   return this.searchedItems;
}
}