import { Component, Input, OnInit, Output } from '@angular/core';
import * as EventEmitter from 'events';
import { title } from 'process';
import { EmpreportService } from '../../providers/empreport.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ExportExcelService } from '../../providers/export-excel.service'
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() data
  @Output() text = new EventEmitter();

  fileName="My_production_data.xlsx"

  titles;
  headings;
  constructor(private empreportService: EmpreportService, private router: Router,private exportExcelService: ExportExcelService) { }

  ngOnInit(): void {

    this.getTitles();

  }
  getTitles() {

 
    if (this.data.length == 0) {
      return;
    }

    this.titles = this.data.map((data) => {
      return Object.keys(data);
    })[0];

    this.titles.pop();
    this.headings = this.titles.map((title) => {
      if (title.includes("_")) {
        return title.replace(/_/g, " ")
      }
      else {
        return title
      }
    })


  }



  edit(data) {

    sessionStorage.setItem("updateID", data.id);
    this.router.navigate(['/sendreport'])

  }

        // export to excel file
        export() {
          /* table id is passed over here */
          let element = document.querySelector(".table-excel");
          this.exportExcelService.exportToExcel(element, this.fileName)
      
        }
}
