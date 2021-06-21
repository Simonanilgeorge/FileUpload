import { Component, Input, OnInit, Output } from '@angular/core';
import * as EventEmitter from 'events';
import { title } from 'process';
import { EmpreportService } from '../../providers/empreport.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() data
  @Output() text = new EventEmitter();

  titles;
  headings;
  constructor(private empreportService: EmpreportService, private router: Router) { }

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
    console.log(this.headings)

  }



  edit(data) {


    sessionStorage.setItem("updateID", data.id);
    this.router.navigate(['/sendreport'])

  }
}
