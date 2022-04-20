
import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { ExportExcelService } from '../../providers/export-excel.service'
@Component({
  selector: 'app-target-table',
  templateUrl: './target-table.component.html',
  styleUrls: ['./target-table.component.css']
})
export class TargetTableComponent implements OnInit {
  fileName="Target_Table.xlsx"
  flag = 2;
  data = []
  titleName
  titles: string[] = []
  client
  dropDownList
  Processlist = []
  Tasklist = []
  final
  headings = {
    "Client": "Client",
    "Task": "Task",
    "Process": "Process",
    "State": "State",
    "County": "County",
    "Time": "Time",
    "band1": "Band 1",
    "band2": "Band 2",
    "band3": "Band 3",
    "price": "Price"
  }
  columnFilterForm: FormGroup = this.fb.group({
    Task: [""],
    Process: [""],
  })
  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute, private elem: ElementRef, private location: Location,exportExcelService: ExportExcelService) { }
  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole("TargetTableComponent")
    this.route.params.subscribe(params => {
      this.client=params.client
      this.getTargetTable(params.client)
    });
  }
  get Task(){
    return this.columnFilterForm.get("Task")
  }
  get Process(){
    return this.columnFilterForm.get("Process")
  }
  getTargetTable(client) {
    this.empReportService.getTargetTable(client).subscribe((res) => {
      try {
        this.data = res
        this.flag = 1;
        // populate titles
        this.titles = Object.keys(res[0]).filter((element) => {
          return element != "id"
        })
        this.getDropDown()
      }
      catch {
        this.location.back()
      }
    }, (err) => {
      console.log(err.message)
    })
  }

  getTitleName(title) {
    this.titleName = null;
    setTimeout(() => {
      this.titleName = title;
    }, 100)
  }
  getDropDown() {
    this.empReportService.getDropDownList().subscribe((res) => {
      this.dropDownList = res;
      this.changeClientOptions()
    }, (err) => {
      console.log(err.message)
    })
  }
  changeTaskOptions() {

    this.Process.setValue("");
    if (this.Task.value == "") {
      this.Processlist = []
    }
    else {
      this.final = null

      this.final = this.client + this.Task.value
      this.Processlist = this.dropDownList[this.final]
    }
  }
  changeClientOptions() {
    this.Task.setValue("")
    this.Process.setValue("")
    this.Tasklist = this.dropDownList[this.client];
    this.Processlist = []
  }

  titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  }
  // column filter on double click
  // showInput() {
  //   this.showColumnInput = !this.showColumnInput
  // }

    // export to excel file
  export() {
    // / table id is passed over here /
    let element = document.querySelector(".table-excel");
    // this.exportExcelService.exportToExcel(element, this.fileName)
    let Heading = ["edit"];
    this.titles.forEach(element => {
      Heading.push(this.titleCase(this.headings[element]))
    });
    // note

    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element,{dateNF:'mm/dd/yyyy;@',cellDates:true, raw: true});

    // / generate workbook and add the worksheet /
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.utils.sheet_add_aoa(ws, [Heading], {origin:"A2"});
    // / save to file /
    ws['!rows'][0] = { hidden: true };
    ws['!cols'][0] = { hidden: true };
    XLSX.writeFile(wb, this.fileName);
  }

}
