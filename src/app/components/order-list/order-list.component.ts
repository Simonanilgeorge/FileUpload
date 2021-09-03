import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import { EmpreportService } from '../../providers/empreport.service'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ExportExcelService } from '../../providers/export-excel.service'
import * as XLSX from 'xlsx';
import {MultifilterPipe} from '../../pipes/multifilter.pipe'


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [DatePipe,MultifilterPipe]
})
export class OrderListComponent implements OnInit {

  searchedItems;
  flag = 2;
  fileName = "My_production_data.xlsx"
  titles;
  headings;
  toast
  message
  final: any;
  myDate = new Date();
  user: FormGroup
  datas = [];
  currentDate: any;
  startDate;
  endDate;
  dropDownList: any;
  ClientList: string[];
  Tasklist: string[];
  Processlist: string[];
  searchedKeyword
  statusList: string[];

  filterForm: FormGroup = this.fb.group({
    date: [""],
    orderNumber: [""],
    Client: [""],
    Task: [""],
    Process: [""],
    status: [""],
  })

  constructor(private loginService: LoginService, private empreportService: EmpreportService, private fb: FormBuilder, private datePipe: DatePipe, private router: Router, private exportExcelService: ExportExcelService,private multiFilterPipe:MultifilterPipe) {

  }
  ngOnInit(): void {

    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.getDropDown();
    this.initializeDates()
    this.user = this.fb.group({
      account_name: sessionStorage.getItem('account_name'),
      dateFilter: [this.startDate, Validators.required],
      enddateFilter: [this.endDate, Validators.required]
    })
    this.getStatus();

  }


  get dateFilter() {
    return this.user.get("dateFilter")
  }

  get enddateFilter() {
    return this.user.get("enddateFilter")
  }

  get date() {
    return this.filterForm.get("date")
  }
  get Task() {
    return this.filterForm.get("Task")
  }
  get Process() {
    return this.filterForm.get("Process")
  }
  get Client() {
    return this.filterForm.get("Client")
  }

  getStatus() {


    this.flag=2
    if (this.user.status == "INVALID") {
      return;
    }

    this.endDate
    let endDate = new Date(this.enddateFilter.value).getTime();
    let startDate = new Date(this.dateFilter.value).getTime();
    if (startDate > endDate) {
      this.showToastMessage("start date cannot be after end date")

    }

    this.empreportService.getMyStatus(this.user.value).subscribe((res) => {
      
      this.onResponse(res);
      this.getTitles()
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
      // this.getTitles()
    }
    return;
  }


  initializeDates() {

    let year, month, day;
    [year, month, day] = this.datePipe.transform(this.myDate, 'yyyy-MM-dd').split('-');
    let startDate, endDate

    if (day <= "25") {

      endDate = `${month}/${25}/${year}`
      if (month === "01") {
        month = 12;
        year = +year - 1;
        startDate = `${month}/${26}/${year}`
      }
      else {
        startDate = `${+month - 1}/${26}/${year}`
      }
    }
    else {

      startDate = `${month}/${26}/${year}`
      if (month == "12") {
        month = 1;
        year = +year + 1;
        endDate = `${month}/${25}/${year}`
      }
      else {
        endDate = `${+month + 1}/${25}/${year}`
      }
    }
    this.startDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
  }

  getDropDown() {

    this.empreportService.getDropDownList().subscribe((res) => {

      this.dropDownList = res;

      this.ClientList = this.dropDownList.Client;
      this.statusList = this.dropDownList.Status;

    }, (err) => {
      console.log(err.message)
    })
  }

  changeClientOptions(event) {

    this.Task.setValue("");
    this.Process.setValue("");


    this.Tasklist = this.dropDownList[this.filterForm.value.Client];
    this.Processlist = null


  }

  changeTaskOptions(event) {

    this.final = null
    this.Process.setValue("");
    if (this.filterForm.value.Task != "") {
      this.final = this.filterForm.value.Client + this.filterForm.value.Task
    }
    this.Processlist = this.dropDownList[this.final]
  }


  clearFields() {


    this.filterForm.reset({
      date: [""],
      orderNumber: [""],
      Client: [""],
      Task: [""],
      Process: [""],
      status: [""],

    })
    this.Tasklist = null
    this.Processlist = null

  }

  showToastMessage(message) {
    this.message = message;
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }


  getTitles() {

    console.log(this.datas)
    if (this.datas.length == 0) {
      return;
    }

    this.titles = this.datas.map((data) => {
      return Object.keys(data);
    })[0];

    this.titles.pop();
    this.headings = this.titles.map((title) => {
      if (title.includes("_")) {
        return title.replace(/_/g, " ")
      }
      else {
        return title
      }
    })


  }



  edit(data) {

    sessionStorage.setItem("updateID", data.id);
    this.router.navigate(['/sendreport'])

  }

  // export to excel file
  export() {
    // 
    /* table id is passed over here */
    let element = document.querySelector(".table-excel");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { dateNF: 'mm/dd/yyyy;@', cellDates: true, raw: true });

    ws['!rows'][1] = { hidden: true };

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
    // this.exportExcelService.exportToExcel(element, this.fileName)

  }

  delete(data) {
    sessionStorage.setItem("deleteID", data.id);
    this.router.navigate(['/sendreport'])
  }


   public searchItems() {

    console.log("inside component")
     this.searchedItems = this.multiFilterPipe.transform(this.datas,this.filterForm.value);

    return this.searchedItems;
}


}
