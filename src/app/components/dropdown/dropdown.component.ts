import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
