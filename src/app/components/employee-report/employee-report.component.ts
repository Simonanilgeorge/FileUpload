import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css']
})
export class EmployeeReportComponent implements OnInit {

  datas: any;
  constructor(private empreportService: EmpreportService) { }

  ngOnInit(): void {
    this.getReport();
  }

  getReport() {

    this.empreportService.getReport().subscribe((res) => {
      const regex = /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g;
      res=JSON.parse(res)
   
      res.forEach((res)=>{
        res.status.replace(regex, 'simon ');
     
      })
      console.log(res);
      this.datas = res;
    }, (err) => {
      console.log(err.message)
    })
  }

}
