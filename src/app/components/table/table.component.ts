import { Component, Input, OnInit,Output} from '@angular/core';
import * as EventEmitter from 'events';
import { title } from 'process';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
@Input() data
@Output() text=new EventEmitter();

titles;
  constructor() { }

  ngOnInit(): void {

    this.getTitles();

  }
  getTitles() {
   if(!this.data){
      return;
    }
    console.log("inside table component")
    console.log(this.data);
    this.titles = this.data.map((data) => {
      return Object.keys(data);
    })[0];
  }

}
