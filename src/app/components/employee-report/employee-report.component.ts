import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css'],
  providers: [DatePipe]
})
export class EmployeeReportComponent implements OnInit {

  yearlyProductionReport = "0";
  datas: any;
  titleName;
  titles = ["empcode", "name", "doj", "search", "client", "task"];
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

  yearlyFilterForm = this.fb.group({
    dateFilter: [""],
    startDate: [this.datePipe.transform(new Date(), 'yyyy-01-01')],
    endDate: [this.datePipe.transform(new Date(), 'yyyy-12-31')]
  })
  filterForm = this.fb.group({
    dateFilter: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
    startDate: [""],
    endDate: [""]
  });
  constructor(private empreportService: EmpreportService, private fb: FormBuilder, private loginService: LoginService, private datePipe: DatePipe,private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {


    if(this.router.url=="/viewreport"){
      this.yearlyProductionReport = "0";
      this.getReport();
    }
    else if(this.router.url=="/viewyearlyreport"){
      this.yearlyProductionReport = "1";
      this.yearlyProductionOnSubmit()
    }
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
  


  }

  get startYear(){
    return this.yearlyFilterForm.get("startYear")
  }

  get endYear(){
    return this.yearlyFilterForm.get("endYear")
  }

  getReport() {


    this.empreportService.getReport().subscribe((res) => {
      this.onResponse(res);
    }, (err) => {
      console.log(err.message)
    })
  }

  onSubmit() {
    this.flag = 2;
    this.empreportService.getReportByFilter(this.filterForm.value).subscribe((res) => {

      this.onResponse(res);
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
    }


  }

  getTitleName(title) {

    this.titleName = null;
    setTimeout(() => {
      this.titleName = title;
    }, 100)


  }
  showInput() {
    this.showColumnInput = !this.showColumnInput

  }

  yearlyProductionOnSubmit(){


    this.flag = 2;
    this.empreportService.getReportByFilter(this.yearlyFilterForm.value).subscribe((res) => {

      this.onResponse(res);
    }, (err) => {
      console.log(err.message);
    })
  }
}