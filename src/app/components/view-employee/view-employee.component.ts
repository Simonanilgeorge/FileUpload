import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { ExportExcelService } from '../../providers/export-excel.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import {ColumnsortPipe} from '../../pipes/columnsort.pipe'


@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css'],
  providers:[ColumnsortPipe]
})
export class ViewEmployeeComponent implements OnInit {

  searchedItems
  fileName = "employee_details.xlsx"
  modalBoolean: Boolean = false
  titles = [];
  ClientList=[]
  dropDownList
  dataToBeDeleted;
  titleName;
  message = null;
  toast: Boolean = false;
  searchedKeyword;
  data = [];
  singleSearch;
  flag: Boolean = false;
  showColumnInput: Boolean = false;

  columnFilterForm: FormGroup = this.fb.group({
    empcode: [""],
    name: [""],
    doj: [""],
    search: [""],
    client: [""],
    task: [""],
    delay_review_duration: [""],
    delay_reason: [""],
    actual_out_of_review_date: [""],
    planned_out_of_review_date: [""],
    training_duration: [""],
    production_status: [""],
    shift: [""],
    role:[""]
  })



  dropDownFilters=["client","search","shift","production_status","delay_reason"];
  headings = {
    "empcode": "Employee code",
    "name": "Employee name",
    "doj": "Date of Joining",
    "search": "Search/Non-Search",
    "task": "Task",
    "client": "Client",
    "shift": "Shift",
    "production_status": "Production Status",
    "training_duration": "Training Duration",
    "planned_out_of_review_date": "Planned Out of Review Date",
    "actual_out_of_review_date": "Actual Out of Review Date",
    "delay_reason": "Reason for Extension",
    "delay_review_duration": "Review Extension",
    "role":"Role"
  }

  constructor(private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute, private fb: FormBuilder, private exportExcelService: ExportExcelService,private columnSortPipe:ColumnsortPipe) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)

  this.getDropDown()

  }


  getEmployees() {

    // get all employees

    this.empReportService.getEmployees().subscribe((res) => {

      res = JSON.parse(res);
      this.data = res;
      this.titles = this.data.map((data) => {
        return Object.keys(data);
      })[0];
      this.titles.pop()
      this.flag = true
    }, (err) => {
      console.log(err.message);
    })


  }

  edit(data) {

    // edit an employee

    sessionStorage.setItem("employeeID", data.empcode);
    this.router.navigate(['/addemployee'])

  }



  showToastMessage(message) {
    this.message = message;
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }

  getTitleName(title) {

    this.titleName = null;
    setTimeout(() => {
      this.titleName = title;
    }, 100)


  }

  // called on delete 
  showModal(data) {

    sessionStorage.setItem("deleteEmployee",data.empcode)
    this.router.navigate(['/addemployee'])

  }



  public searchItems() {


    this.searchedItems = this.columnSortPipe.transform(this.data,this.columnFilterForm.value);

   return this.searchedItems;
}

getDropDown() {

  this.empReportService.getDropDownList().subscribe((res) => {

    this.dropDownList = res;

    this.ClientList = this.dropDownList.Client;
    
    this.getEmployees();

  }, (err) => {
    console.log(err.message)
  })
}
}