import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css']
})
export class EmployeeReportComponent implements OnInit {

  datas: any;
  allData: any;
  flag: boolean = true;

  filterForm = this.fb.group({
    dateFilter: ['']
  });
  constructor(private empreportService: EmpreportService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getReport();
  }

  getReport() {

    this.empreportService.getReport().subscribe((res) => {
      this.onResponse(res);

    }, (err) => {
      console.log(err.message)
    })
  }

  filter(event) {


  
    let name = event.target.value;
    this.datas = this.datas.filter((n) => {
      return n.username.toLowerCase().includes(name.toLowerCase());
    })

    if (name.trim().length === 0) {

      this.datas = this.allData;
    }

  }


  onSubmit() {

    this.empreportService.getReportByFilter(this.filterForm.value).subscribe((res) => {

      this.onResponse(res);
    }, (err) => {
      console.log(err.message);
    })

  }

  onResponse(res) {
    res = res.replace(/\\n/g, "<br>");
    res = JSON.parse(res);
    this.datas = res;
    if (this.datas.length == 0) {
      this.flag = false;
      return;
    }
    else {
      this.flag = true;
    }
    this.allData = res;

  }

}


