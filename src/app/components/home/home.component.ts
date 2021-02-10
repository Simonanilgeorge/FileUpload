import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UploadService } from '../../providers/upload.service'
import * as _ from 'lodash';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;
  SLAExpirationFilter: String[] = []
  titles: String[] = [];
  dates: String[] = [];
  datas: any = null;
  div1: boolean = true;
  div2: boolean = false;
  flag: Number = 0;
  columnTotal = 0;
  columnSum = {};
  expanded: Boolean = false;
  filterDate:any={};

  constructor(private formBuilder: FormBuilder, private uploadService: UploadService) { }

  ngOnInit(): void {
    this.fileUploadForm = this.formBuilder.group({
      rvsi: [''],
      sp2: ['']

    });

  }

  divFunction() {
    this.div1 = !this.div1;
    this.div2 = !this.div2;
    this.ngOnInit();

  }

  showCheckboxes() {
    // var checkboxes = document.getElementById("checkboxes");


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
  applyFilter(){
    
    this.filterDate['date']=this.SLAExpirationFilter;


    console.log(JSON.stringify(this.filterDate))
    this.uploadService.getFilteredData(this.filterDate).subscribe((res)=>{
      this.titles=[];
      this.datas=null;


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
        console.log(this.datas)
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
        // this.divFunction();

        
        if (res.statusCode === 200) {
          // Reset the file input
          this.uploadFileInput.nativeElement.value = "";
          this.fileInputLabel = undefined;
        }
      }

    },(err)=>{
      console.log(err.message)
    })
  }
  onFileSelect(event) {
    this.titles = [];
    let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (event.target.files.length == 2) {
      const file1 = event.target.files[0];
      const file2 = event.target.files[1];
      // console.log(file);

      if (!_.includes(af, file1.type || file2.type)) {
        alert('Only EXCEL Docs Allowed!');
      }
      else {
        this.fileUploadForm.get('rvsi').setValue(file1);
        this.fileUploadForm.get('sp2').setValue(file2);
        this.flag = 0;
        //console.log(this.fileUploadForm.value);
      }
    }
    else {

      this.flag = 1;

    }
  }

  onFormSubmit() {

    if (this.flag == 1) {
      alert("you can only choose two files")
      return;

    }
    else {
      if (!this.fileUploadForm.get('rvsi').value && !this.fileUploadForm.get('sp2').value) {
        alert('Please fill valid details!');
        return false;
      }

      const formData = new FormData();
      formData.append('rvsi', this.fileUploadForm.get('rvsi').value);
      formData.append('sp2', this.fileUploadForm.get('sp2').value)

      this.uploadService.uploadFile(formData).subscribe((res) => {

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
          console.log(this.datas)
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
          this.divFunction();

          
          if (res.statusCode === 200) {
            // Reset the file input
            this.uploadFileInput.nativeElement.value = "";
            this.fileInputLabel = undefined;
          }
        }
      }, (err) => {
        console.log(err.message);
      })
    }
  }
}







// {"date":["2021/02/03"]}
//  [
//     {
//         "Task_Name": "AbstractIndexingModule",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "BillingInformation",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "BillingReminder",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "CJNJTaxSearchAwaitingResponse",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "CJUpperCourtContinUpload",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "CondoLienException",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "DeliverE",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "Examination",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "HOADatabase",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "LocatePropertyReview",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OrderEntry",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSAttorneyDeliverE",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSBillingReminder",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSJudgmentLien",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSPreSearch",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSSearch",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSSearchFix",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSSearchReview",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSUpdateSearch",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSVMQualityControl",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSVMQualityControlFix",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSVMQualityControlReview",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSWSearch",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "OSWUpdateSearch",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "PacerSearch",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "PatriotAct",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "PortalUpload",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "PreSearch",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "PriorPolicy",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "QualityControl",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "Search",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "SearchFix",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "SearchReview",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "SpecialInstructions",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "TaxCert",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "TidelandDecision",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "TypingModule",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "TypingModuleReview",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "TypingReview",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "UpdateSearch",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "UpdateSearchReview",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "VendorCertification",
//         "Grand_total": 0
//     },
//     {
//         "Task_Name": "VMQualityControl",
//         "PA": 1,
//         "Grand_total": 1
//     },
//     {
//         "Task_Name": "VMQualityControlReview",
//         "Grand_total": 0
//     },
//     {
//         "SLAExpiration": [
//             "2021/02/03"
//         ]
//     }
// ]