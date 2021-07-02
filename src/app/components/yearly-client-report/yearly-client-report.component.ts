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
  providers:[DatePipe]
})
export class YearlyClientReportComponent implements OnInit {


  message
  toast
  filterForm = this.fb.group({
    startDate: [this.datePipe.transform(new Date(), 'yyyy-01-01')],
    endDate:[this.datePipe.transform(new Date(), 'yyyy-12-31')]

  });

  constructor(private empreportService: EmpreportService, private fb: FormBuilder, private loginService: LoginService, private datePipe: DatePipe,private route: ActivatedRoute,private router: Router) { }



  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)

  }

  get startDate(){
    return this.filterForm.get("startDate")
  }

  get endDate(){
    return this.filterForm.get("endDate")
  }

onSubmit(){
  let startDate = new Date(this.startDate.value).getTime();
  let endDate = new Date(this.endDate.value).getTime();

  if(startDate>endDate){
    this.showToastMessage("start date cannot be after end date")
    return
  }
console.log(this.filterForm.value)
}


showToastMessage(message) {
  this.message = message;
  this.toast = true;
  setTimeout(() => {
    this.toast = false;
  }, 2000)
}
}
