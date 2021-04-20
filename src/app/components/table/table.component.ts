import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  titles;
  data = [{
    name: "John",
    age: 25,
    contact:74839
  }, {
    name: "Doe",
    age: 45,
    contact:462367
  },
  {
    name: "Pam",
    age: 30,
    contact:74842
  }];
  constructor() { }

  ngOnInit(): void {

    this.getTitles();

  }

  getTitles() {
    this.titles = this.data.map((data) => {
      return Object.keys(data);
    })[0];

  }

}
