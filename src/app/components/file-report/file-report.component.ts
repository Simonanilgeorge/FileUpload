import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../providers/upload.service'
import { LoginService } from '../../providers/login.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-file-report',
  templateUrl: './file-report.component.html',
  styleUrls: ['./file-report.component.css']
})
export class FileReportComponent implements OnInit {
  expanded: Boolean = true;
  SLAExpirationFilter: String[] = []
  flag: number = 2;
  flg: number = 0;
  filterDate: any = {};
  dt: any = {};
  checklist: any = [];
  titles: String[] = [];
  dates: String[] = [];
  datas: any = null;
  columnTotal = 0;
  columnSum = {};
  checkedList: any;
  masterSelected: boolean;
  time = [];
  pivotTableForm = this.fb.group({
    pivotDate: [new Date().toISOString().split('T')[0]],
    time: [""]
  })
  constructor(private uploadService: UploadService, private loginService: LoginService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.fetchTable('date');
    this.masterSelected = false;
    this.getCheckedItemList();

  }



  get pivotDate() {
    return this.pivotTableForm.get("pivotDate");
  }
  get time_(){
    return this.pivotTableForm.get("time");
  }
  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.checklist.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if (this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }

  }

  // getReportData() {

  //   this.uploadService.getData().subscribe((res) => {

  //     this.onResponse(res)
  //   }, (err) => {
  //     console.log(err.message)
  //   })
  // }


  // function to hide/show checkboxes
  showCheckboxes() {

    if (!this.expanded) {

      this.expanded = true;
    } else {
      this.expanded = false;
    }
  }


  // function called when a filter is applied
  applyFilter() {


    // add pivotdate key to filterdate object
    this.filterDate['pivotdate'] = this.pivotDate.value;
    this.filterDate['time'] = this.time_.value;

    this.expanded = true;
    this.filterDate['date'] = this.checkedList.map((list) => {
      return list.date;
    })

    this.uploadService.getFilteredData(this.filterDate).subscribe((res) => {
      this.titles = [];
      this.datas = null;
      console.log(res)
      this.onResponse(res)

    }, (err) => {
      console.log(err.message)
    })
  }

  onResponse(res) {


    this.datas = JSON.parse(res);
    if ((Object.keys(this.datas)).includes("error_in_file")) {
      alert("Please choose a proper file with vaild details");
    }
    else {

      this.datas.forEach((data) => {
        // add all the dates to the array dates
        for (let d in data) {
          if (d == "SLAExpiration") {
            this.dates = data[d]
          }
          
          if (d == "timeArray") {
            this.time = data[d];

          }
          // block to skip keys
          if (this.titles.includes(d) || d == "Task_Name" || d == "null" || d == "Grand_total" || d == "SLAExpiration" || d == "timeArray") {
            continue;
          }
          // block to find the grand total for each state
          else {
            this.columnSum[d] = 0;
            this.titles.push(d);
          }
        }
      })
      // remove the SLAExiration dates object from datas array
      this.datas.pop()
      this.datas.pop()


      // To find the grand total for each task


      if (this.datas.length == 0) {
        this.flag = 0;

        return;
      }
      else {
        this.flag = 1;
      }

      this.columnSum["Grand_total"] = 0;
      this.datas.forEach((data) => {
        for (let row in data) {
          if (row != "Task_Name" && row != "null") {
            this.columnSum[row] = this.columnSum[row] + data[row];
          }

        }
      })

      // sort the titles in alphabetical order
      this.titles = this.titles.sort();

      // call this function to hide/show form and table



      if (res.statusCode === 200) {
        // Reset the file input
        console.log("success")
      }
    }


    if (this.flg == 0) {

      for (var i = 0; i < this.dates.length; i++) {

        this.dt["id"] = i
        this.dt["date"] = this.dates[i];
        this.dt["isSelected"] = false;
        this.checklist.push(this.dt)
        this.dt = []

      }
  
      this.flg = 1;
    }

  }


  fetchTable(name) {

    this.flag=2;
    if(name == "date"){
      this.pivotTableForm.get("time").setValue("")
    }
    console.log(this.pivotTableForm.value)
    this.uploadService.getFilteredPivotTable(this.pivotTableForm.value).subscribe((res) => {

      this.flg = 0
      this.checklist = []
      this.onResponse(res)
      if (this.time.length != 0 && name == "date"){
        this.pivotTableForm.get("time").setValue(this.time[0])
      }
    }, (err) => {
      console.log(err.message);
    })
  }

}