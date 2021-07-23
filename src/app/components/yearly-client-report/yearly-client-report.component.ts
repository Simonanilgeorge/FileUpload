import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../providers/login.service'
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-yearly-client-report',
  templateUrl: './yearly-client-report.component.html',
  styleUrls: ['./yearly-client-report.component.css'],
  providers: [DatePipe]
})
export class YearlyClientReportComponent implements OnInit {


  data=[]
  flag = 2;
  message
  toast
  filterForm = this.fb.group({
    startDate: [this.datePipe.transform(new Date(), 'yyyy-01-01')],
    endDate: [this.datePipe.transform(new Date(), 'yyyy-12-31')]

  });

  constructor(private empreportService: EmpreportService, private fb: FormBuilder, private loginService: LoginService, private datePipe: DatePipe, private route: ActivatedRoute, private router: Router) { }



  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.onSubmit()

  }



  get startDate() {
    return this.filterForm.get("startDate")
  }

  get endDate() {
    return this.filterForm.get("endDate")
  }

  onSubmit() {
    this.flag = 2;
    let startDate = new Date(this.startDate.value).getTime();
    let endDate = new Date(this.endDate.value).getTime();

    if (startDate > endDate) {
      this.showToastMessage("start date cannot be after end date")
      return
    }



    this.empreportService.getYearlyClientReport(this.filterForm.value).subscribe((res) => {

      this.data=JSON.parse(res)
      if(this.data.length==0){
        this.flag = 0;
      }
      else{
        this.flag=1
      }

    }, (err) => {
      console.log(err.message)
    })
  }


  showToastMessage(message) {
    this.message = message;
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }
}
