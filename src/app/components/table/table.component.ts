import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
@Input() data


localData;
  
titles;
  // data = [{
  //   name: "John",
  //   age: 25,
  //   contact:74839
  // }, {
  //   name: "Doe",
  //   age: 45,
  //   contact:462367
  // },
  // {
  //   name: "Pam",
  //   age: 30,
  //   contact:74842
  // }];
  constructor() { }

  ngOnInit(): void {

    this.getTitles();

  }

  getTitles() {
    this.localData=this.data
    console.log("inside table component")
    console.log(this.data);
    this.titles = this.data.map((data) => {
      return Object.keys(data);
    })[0];


  }

}
