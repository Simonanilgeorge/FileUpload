import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import { EmpreportService } from '../../providers/empreport.service'
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
  providers: [DatePipe]
})
export class OrderListComponent implements OnInit {
  flag: boolean = true;

  final: any;
  myDate = new Date();
  user: FormGroup
  datas;
  currentDate: any;
  startDate;
  endDate;
  dropDownList: any;
  ClientList: string[];
  Tasklist: string[];
  Processlist: string[];
  searchedKeyword
  statusList: string[];

  filterForm:FormGroup=this.fb.group({
    date: [""],
    orderNumber: [""],
    Client: [""],
    Task: [""],
    Process: [""],
    status: [""],
  })

  constructor(private loginService: LoginService, private empreportService: EmpreportService, private fb: FormBuilder, private datePipe: DatePipe) {

  }
  ngOnInit(): void {

    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.getDropDown();
    this.initializeDates()
    this.user = this.fb.group({
      account_name: sessionStorage.getItem('account_name'),
      dateFilter: [this.startDate,Validators.required],
      enddateFilter: [this.endDate,Validators.required]
    })
    this.getStatus();

  }


  get date(){
    return this.filterForm.get("date")
  }
  get Task() {
    return this.filterForm.get("Task")
  }
  get Process() {
    return this.filterForm.get("Process")
  }
  get Client(){
    return this.filterForm.get("Client")
  }

  getStatus() {

    if(this.user.status=="INVALID"){
      return;
    }

    this.empreportService.getMyStatus(this.user.value).subscribe((res) => {

      this.onResponse(res);
    }, (err) => {
      console.log(err.message);
    })
  }


  onResponse(res) {


    res = JSON.parse(res);

    this.datas = res;
    if (this.datas.length == 0) {
      this.flag = false;
      return;
    }
    else {
      this.flag = true;
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
    if(this.filterForm.value.Task != ""){
      this.final = this.filterForm.value.Client + this.filterForm.value.Task
    }
    this.Processlist = this.dropDownList[this.final]
  }


  clearFields(){

    this.filterForm.reset({
      date: [""],
      orderNumber: [""],
      Client: [""],
      Task: [""],
      Process: [""],
      status: [""],

    })
    
  }

}
