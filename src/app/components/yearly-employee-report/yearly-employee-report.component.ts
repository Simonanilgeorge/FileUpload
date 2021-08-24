import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import { DatePipe } from '@angular/common';
import { ExportExcelService } from '../../providers/export-excel.service'

@Component({
  selector: 'app-yearly-employee-report',
  templateUrl: './yearly-employee-report.component.html',
  styleUrls: ['./yearly-employee-report.component.css'],
  providers: [DatePipe]
})
export class YearlyEmployeeReportComponent implements OnInit {

  constructor(private empreportService: EmpreportService, private fb: FormBuilder, private loginService: LoginService, private datePipe: DatePipe,private route: ActivatedRoute,private router: Router,private exportExcelService: ExportExcelService) { }


  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
  }

}
