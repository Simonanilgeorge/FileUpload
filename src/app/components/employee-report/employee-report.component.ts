import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css']
})
export class EmployeeReportComponent implements OnInit {

  datas: any;

  
  flag: boolean = false;
  searchedKeyword: string;

  filterForm = this.fb.group({
    dateFilter: ['']
  });
  constructor(private empreportService: EmpreportService, private fb: FormBuilder,private loginService:LoginService) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.getReport();

  }

  getReport() {

    this.empreportService.getReport().subscribe((res) => {

      this.onResponse(res);


    }, (err) => {
      console.log(err.message)
    })
  }

  onSubmit() {

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
      this.flag = false;
      return;
    }
    else {
      this.flag = true;
    }


  }

}