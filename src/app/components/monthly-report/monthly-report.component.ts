import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service'
import { DatePipe } from '@angular/common';
import { ExportExcelService } from '../../providers/export-excel.service'
import {ColumnsortPipe} from '../../pipes/columnsort.pipe'



@Component({
  selector: 'app-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css'],
  providers:[DatePipe,ColumnsortPipe]
})
export class MonthlyReportComponent implements OnInit {
  searchedItems
  fileName="monthly_production_report.xlsx"
  flag: Boolean = false;
  titleName;
  message;
  toastStatus
  total: any = 0
  columnSum = {};
  toast: Boolean = false
  searchedKeyword: string;
  data = [];
  dates = [];
  ClientList=[]
  dropDownList: any;
  headings = {
    "empcode": "Employee code",
    "name": "Employee name",
    "doj": "Date of Joining",
    "search": "Search/Non-Search",
    "client": "Client",
    "task": "Task"
  }

  titles=["empcode","name","doj","search","client","task"];
  sheetNameRes;
  SheetList = ["Revenue", "Productivity", "Utilization", "Orders"];
  showColumnInput;
  columnFilterForm:FormGroup=this.fb.group({
    empcode:[""],
    name: [""],
    doj: [""],
    search: [""],
    client: [""],
    task: [""]
  })
  Date = this.fb.group({
    date: [this.datePipe.transform(new Date(),"yyyy-MM"), Validators.required],
    sheetName: ['Revenue', Validators.required]
  })


  constructor(private loginService: LoginService, private fb: FormBuilder, private empReportService: EmpreportService,private datePipe:DatePipe,private exportExcelService: ExportExcelService,private columnSortPipe:ColumnsortPipe) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole("MonthlyReportComponent")
    this.getDropDown();

  }

  get date() {
    return this.Date.get("date");
  }


  // function called on ngOnInit()
  filter() {

    if (this.Date.status === "INVALID") {
      this.showToastMessage("Select month and sheet","warning");
      return;
    }
    this.empReportService.getMonthlyReport(this.Date.value).subscribe((res) => {

      res = JSON.parse(res);

      this.data = res.data;
      this.dates = res.dates;
       
      this.sheetNameRes=res.sheet;
      
      this.total = 0
      // initialize columnsum keys to 0
      this.dates.forEach((date)=>{
        this.columnSum[date]=0;
      })
     
      // check if value exist in data
      this.data.forEach(datas => {
        this.total = this.total + datas.total
        this.dates.forEach((date)=>{
          if(datas[date]){
            this.columnSum[date]=this.columnSum[date]+datas[date]
          }
        }) 
        
      });

      this.flag = true
    }, (err) => {
      console.log(err.message)
    })
  }

  showToastMessage(message,status) {
    this.message = message;
    this.toastStatus=`${status}`
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }

  getTitleName(title){

    this.titleName=null;
    setTimeout(()=>{
      this.titleName=title;
    },100)
  }

  // showInput(){
  //   this.showColumnInput = !this.showColumnInput

  // }

  checkDay(date){
    if(new Date(date).getDay() == 0 || new Date(date).getDay() == 6)
    {
      return true
    }
    else{
      return false
    }
  }
      // export to excel file
      export() {
        /* table id is passed over here */
        let element = document.querySelector(".table-excel");
        this.exportExcelService.exportToExcel(element, this.fileName)
    
      }

   public searchItems() {


     this.searchedItems = this.columnSortPipe.transform(this.data,this.columnFilterForm.value);

    return this.searchedItems;
}

getDropDown() {

  this.empReportService.getDropDownList().subscribe((res) => {

    this.dropDownList = res;

    this.ClientList = this.dropDownList.Client;
    
    this.filter()

  }, (err) => {
    console.log(err.message)
  })
}
}