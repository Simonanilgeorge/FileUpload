import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import { EmpreportService } from '../../providers/empreport.service'
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ExportExcelService } from '../../providers/export-excel.service'
import * as XLSX from 'xlsx';
import { MultifilterPipe } from '../../pipes/multifilter.pipe'
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [DatePipe, MultifilterPipe]
})
export class OrderListComponent implements OnInit {
  searchedItems;
  titleName;
  flag = 2;
  fileName = "My_Production_Data.xlsx"
  titles;
  // headings;
  toast
  message
  toastStatus
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
    client: [""],
    task: [""],
    process: [""],
    status: [""],
  })
  headings = {
    "date": "Date",
    "order_number": "Order Number",
    "client": "Client",
    "task": "Task",
    "process": "Process",
    "state": "State",
    "county":"County",
    "mode":"Mode",
    "parcels":"Parcels",
    "exception":"Exception",
    "start_Time": "Start Time",
    "end_Time": "End Time",
    "total_Time":"Total Time",
    "status": "Status",
    "last_updated_time": "Last Updated Time",
    "comments":"Comments"

  }
  constructor(private loginService: LoginService, private empreportService: EmpreportService, private fb: FormBuilder, private datePipe: DatePipe, private router: Router, private exportExcelService: ExportExcelService, private multiFilterPipe: MultifilterPipe) {
  }
  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole("OrderListComponent")
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
  get task() {
    return this.filterForm.get("task")
  }
  get process() {
    return this.filterForm.get("process")
  }
  get client() {
    return this.filterForm.get("client")
  }
  getStatus() {
    if (this.user.status == "INVALID") {
      this.flag = 0;
      return;
    }
    this.flag = 2
    this.endDate
    let endDate = new Date(this.enddateFilter.value).getTime();
    let startDate = new Date(this.dateFilter.value).getTime();
    if (startDate > endDate) {
      this.showToastMessage("start date cannot be after end date", "warning")
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
  getTitleName(title) {
    this.titleName = null;
    setTimeout(() => {
      this.titleName = title;
    }, 100)
  }
  changeClientOptions(event) {
    this.task.setValue("");
    this.process.setValue("");
    this.Tasklist = this.dropDownList[this.filterForm.value.client];
    this.Processlist = null
  }
  changeTaskOptions(event) {
    this.final = null
    this.process.setValue("");
    if (this.filterForm.value.task != "") {
      this.final = this.filterForm.value.client + this.filterForm.value.task
    }
    this.Processlist = this.dropDownList[this.final]
  }
  clearFields() {
    this.filterForm.reset({
      date: [""],
      orderNumber: [""],
      client: [""],
      task: [""],
      process: [""],
      status: [""],
    })
    this.Tasklist = null
    this.Processlist = null
  }
  showToastMessage(message, status) {
    this.message = message;
    this.toastStatus = `${status}`
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }
  getTitles() {
    if (this.datas.length == 0) {
      return;
    }
    this.titles=Object.keys(this.datas[0])
    this.titles.pop();
  }
  edit(data) {
    sessionStorage.setItem("updateID", data.id);
    this.router.navigate(['/sendreport'])
  }
  // export to excel file
  export() {
    //
    // / table id is passed over here /
    let element = document.querySelector(".table-excel");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { dateNF: 'mm/dd/yyyy;@', cellDates: true, raw: true });
    // ws['!rows'][1] = { hidden: true };
    // ws['!cols'][0] = { hidden: true };
    ws['!cols'][0] = { hidden: true };
    let nul = [""];
    let Heading = [""];
    for (var property in this.headings) {
      nul.push("")
      Heading.push(this.headings[property])
    }
    // / generate workbook and add the worksheet /
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.utils.sheet_add_aoa(ws, [nul], {origin:"A2"});
    XLSX.utils.sheet_add_aoa(ws, [Heading], {origin:"A3"});
    // / save to file /
    ws['!rows'][0] = { hidden: true };
    ws['!rows'][1] = { hidden: true };
    XLSX.writeFile(wb, this.fileName);
    // this.exportExcelService.exportToExcel(element, this.fileName)
  }
  delete(data) {
    sessionStorage.setItem("deleteID", data.id);
    this.router.navigate(['/sendreport'])
  }
  public searchItems() {
    this.searchedItems = this.multiFilterPipe.transform(this.datas, this.filterForm.value);
    return this.searchedItems;
  }
}