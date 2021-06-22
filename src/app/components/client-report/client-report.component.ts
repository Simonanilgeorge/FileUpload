import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.css'],
  providers: [DatePipe]
})
export class ClientReportComponent implements OnInit {

  data = [];
  flag: boolean = false;
  dates = [];
  searchedKeyword: string;
  columnSum
  total

  Date = this.fb.group({
    date: [this.datePipe.transform(new Date(), "yyyy-MM"), Validators.required]
  })
  constructor(private loginService: LoginService, private fb: FormBuilder, private empReportService: EmpreportService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.onSubmit()
  }


  onSubmit() {

    this.empReportService.getClientReport(this.Date.value).subscribe((res) => {

      res = JSON.parse(res);

      this.dates = res.dates;
      this.data = res.data;

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
      this.flag = true;
    }, (err) => {
      console.log(err.message);
    })
  }
}