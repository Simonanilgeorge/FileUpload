import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service'

@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit {

  Date = this.fb.group({
    date: ['']
  })
  constructor(private loginService: LoginService, private fb: FormBuilder, private empReportService: EmpreportService) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
  }


  filter() {
    console.log(this.Date.value);
    this.empReportService.getMonthlyReport(this.Date.value).subscribe((res) => {
      console.log(res)
    }, (err) => {
      console.log(err.message)
    })
  }
}
