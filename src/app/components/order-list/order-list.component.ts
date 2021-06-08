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

  myDate = new Date();
  user: FormGroup
  datas;
  currentDate: any;
  startDate;
  endDate;

  constructor(private loginService: LoginService, private empreportService: EmpreportService, private fb: FormBuilder, private datePipe: DatePipe) {

  }
  ngOnInit(): void {

    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.initializeDates()
    this.user = this.fb.group({
      account_name: sessionStorage.getItem('account_name'),
      dateFilter: [this.startDate,Validators.required],
      enddateFilter: [this.endDate,Validators.required]
    })
    this.getStatus();

  }

  getStatus() {

    if(this.user.status=="INVALID"){
      return;
    }
    console.log(this.user.value)
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
}



