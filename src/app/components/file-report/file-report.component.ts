import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../providers/upload.service'
import { LoginService } from '../../providers/login.service'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-file-report',
  templateUrl: './file-report.component.html',
  styleUrls: ['./file-report.component.css']
})
export class FileReportComponent implements OnInit {

  expanded: Boolean = true;
  SLAExpirationFilter: String[] = []
  // flag:boolean=true;
  filterDate: any = {};
  titles: String[] = [];
  dates: String[] = [];
  datas: any = null;
  columnTotal = 0;
  columnSum = {};

  constructor(private uploadService: UploadService, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.getReportData();

  }

  getReportData() {

    console.log("Get method")
    this.uploadService.getData().subscribe((res) => {
      console.log("this is the response from the server")
      console.log(res)
      // if(res==null)
      this.onResponse(res)
    }, (err) => {
      console.log(err.message)
    })
  }


// function to hide/show checkboxes
showCheckboxes() {

  if (!this.expanded) {

     this.expanded = true;
   } else {
     this.expanded = false;
   }
 }


  //Add the dates to the array 
  filter(date) {

    console.log(date);
    // check if date already exists in the array
    if (!this.SLAExpirationFilter.includes(date)) {

      this.SLAExpirationFilter.push(date);
    }
    else {

      // this block removes the date from the array
      let index;
      index = this.SLAExpirationFilter.findIndex((sla) => {
        return sla == date;
      })

      console.log(index)
      this.SLAExpirationFilter.splice(index, 1)
    }
    console.log(this.SLAExpirationFilter)

 }

  // function called when a filter is applied
  applyFilter() {

    this.expanded = true;
    this.filterDate['date'] = this.SLAExpirationFilter;


    console.log(JSON.stringify(this.filterDate))
    this.uploadService.getFilteredData(this.filterDate).subscribe((res) => {
      this.titles = [];
      this.datas = null;
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
          // block to skip keys
          if (this.titles.includes(d) || d == "Task_Name" || d == "null" || d == "Grand_total" || d == "SLAExpiration") {
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


      // To find the grand total for each task
      console.log("this.datas:")
      console.log(this.datas)
      // if(this.datas==[]){
      //   this.flag=true;
      //   return;
      // }

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


  }

  
}
