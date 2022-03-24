import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-dropdown-search',
  templateUrl: './dropdown-search.component.html',
  styleUrls: ['./dropdown-search.component.css']
})
export class DropdownSearchComponent implements OnInit {
  @Input() array
  @Input() field
  @Input() display
  @Output() displayChange=new EventEmitter()
  constructor(private fb: FormBuilder) { }
  ngOnInit(): void {
  }
  // dropdown checkbox
  populateField(element){
    this.field.setValue(element)
  }
  displayDropDown(event) {
    event.stopPropagation()
    this.display = !this.display
    this.displayChange.emit(this.display)
  }
}
