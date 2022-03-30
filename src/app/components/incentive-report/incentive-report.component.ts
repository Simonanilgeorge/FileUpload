import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../providers/login.service'
import { FormBuilder, Validators } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service';
import { ExportExcelService } from '../../providers/export-excel.service'
import { ColumnsortPipe } from '../../pipes/columnsort.pipe'
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-incentive-report',
  templateUrl: './incentive-report.component.html',
  styleUrls: ['./incentive-report.component.css'],
  providers: [DatePipe, ColumnsortPipe]
})
export class IncentiveReportComponent implements OnInit {
  searchedItems
  // Daily Production report
  fileName = "Incentive_Report.xlsx"

  datas: any;
  titleName;
  dropDownList
  Tasklist = []
  ClientList = []
  Processlist = []
  final
  textFilters = ["empcode", "name", "doj"];
  titles = ['empcode', 'name', 'doj', 'production_status', 'shift', 'search', 'client', 'task', 'process', 'state', 'band1', 'band2', 'band3', 'order_count', 'productivity_band', 'quality_band', 'final_band']
  headings = {
    "empcode": "Employee code",
    "name": "Employee name",
    "doj": "Date of Joining",
    "production_status": "Production Status",
    "shift": "Shift",
    "search": "Search/Non-Search",
    "client": "Client",
    "task": "Task",
    "process": "Process",
    "state": "State",
    "band1": "Band 1",
    "band2": "Band 2",
    "band3": "Band 3",
    "order_count": "Completed Orders",
    "productivity_band": "Productivity Band",
    "quality_band": "Quality Band",
    "final_band": "Final Band"
  }
  // titles=Object.keys(this.headings)

  // SheetList = ["Revenue", "Productivity", "Utilization", "Orders"];
  flag = 2;
  searchedKeyword: string;
  showColumnInput;

  columnFilterForm = this.fb.group({
    empcode: [""],
    name: [""],
    doj: [""],
    search: [""],
    client: [""],
    task: [""],
    process: [""],
    shift: [""],
    production_status: [""],
    productivity_band: [""]
  })

  form = this.fb.group({
    startDate: [""],
    endDate: [""],
    date: [this.datePipe.transform(new Date(), "yyyy-MM"), Validators.required]

  })

  constructor(private datePipe: DatePipe, private columnSortPipe: ColumnsortPipe, exportExcelService: ExportExcelService, private empreportService: EmpreportService, private loginService: LoginService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.loginService.checkSessionStorage();
    this.getDropDown()
    this.getReport()
    this.loginService.navigateByRole("IncentiveReportComponent")



  }
  get task() {
    return this.columnFilterForm.get("task")
  }

  get process() {
    return this.columnFilterForm.get("process")
  }

  get client() {
    return this.columnFilterForm.get("client")
  }

  get date() {
    return this.form.get("date")
  }
  get startDate() {
    return this.form.get("startDate")
  }
  get endDate() {
    return this.form.get("endDate")
  }


  filter() {

    let month, year, start, end
    [year, month] = this.date.value.split("-")
    end = `${+month}/${25}/${+year}`
    if (month === "01") {
      start = `12/${26}/${+year - 1}`
    }
    else {
      start = `${+month-1}/${26}/${+year}`
    }

    this.startDate.setValue( this.datePipe.transform(start, 'yyyy-MM-dd'))
    this.endDate.setValue(this.datePipe.transform(end, 'yyyy-MM-dd'))


  }
  // get daily production report(called initially with no date)
  getReport() {
    this.flag=2
    this.filter()
    this.empreportService.getIncentiveReport(this.form.value).subscribe((res)=>{

      this.onResponse(res)

    },(err)=>{
      console.log(err.message)
    })
  }



  changeClientOptions() {

    this.task.setValue("")
    this.process.setValue("")
    this.Tasklist = this.dropDownList[this.columnFilterForm.value.client];
    this.Processlist = []
  }
  // function called when task value is changed
  changeTaskOptions() {
    if (this.task.value == "") {
      this.Processlist = []
    }
    else {
      this.final = null
      this.process.setValue("");
      this.final = this.client.value + this.task.value
      this.Processlist = this.dropDownList[this.final]
    }

  }
  //call this function with filter form values
  // onSubmit() {

  //   if (this.filterForm.status === "INVALID") {
  //     this.flag=0;
  //     return;
  //   }
  //   this.flag = 2;
  //   this.empreportService.getReportByFilter(this.filterForm.value).subscribe((res) => {

  //     this.onResponse(res);
  //   }, (err) => {
  //     console.log(err.message);
  //   })

  // }



  // function called on response 
  onResponse(res) {

    this.datas = res;
    if (this.datas.length == 0) {
      this.flag = 0;
      return;
    }
    else {
      this.flag = 1;
    }


  }

  // reset titlename for sort(ascending descending)
  getTitleName(title) {

    this.titleName = null;
    setTimeout(() => {
      this.titleName = title;
    }, 100)
  }


  titleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
  }


  // export to excel file
  export() {
    // / table id is passed over here /
    let element = document.querySelector(".table-excel");
    // this.exportExcelService.exportToExcel(element, this.fileName)
    let Heading = [];
    this.titles.forEach(element => {
      Heading.push(this.titleCase(this.headings[element]))
    });

    // note


    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { dateNF: 'mm/dd/yyyy;@', cellDates: true, raw: true });
    // / generate workbook and add the worksheet /
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.utils.sheet_add_aoa(ws, [Heading], { origin: "A2" });
    // / save to file /
    ws['!rows'][0] = { hidden: true };
    XLSX.writeFile(wb, this.fileName);
  }
  public searchItems() {


    this.searchedItems = this.columnSortPipe.transform(this.datas, this.columnFilterForm.value);

    return this.searchedItems;
  }

  getDropDown() {

    this.empreportService.getDropDownList().subscribe((res) => {

      this.dropDownList = res;

      this.ClientList = this.dropDownList.Client;
      this.getReport();


    }, (err) => {
      console.log(err.message)
    })
  }
}
