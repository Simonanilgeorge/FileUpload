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
  constructor(private empreportService: EmpreportService, private router: Router) { }

  ngOnInit(): void {

    this.getTitles();

  }
  getTitles() {
    if (!this.data) {
      return;
    }

    this.titles = this.data.map((data) => {
      return Object.keys(data);
    })[0];


    this.titles.pop();
  }
  edit(data) {

  
    sessionStorage.setItem("updateID", data.id);
    this.router.navigate(['/sendreport'])

  }
}
