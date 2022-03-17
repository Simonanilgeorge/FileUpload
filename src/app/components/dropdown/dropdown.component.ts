import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {
  @Input() array
  @Input() localArray
  @Input() display
  @Output() displayChange=new EventEmitter()
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

    // dropdown checkbox
    test(element, event) {

      event.stopPropagation()
  
      if (this.array.getRawValue().includes(element)) {
        this.array.removeAt(this.array.getRawValue().findIndex((f) => f == element))
      }
      else {
        this.array.push(this.fb.control(element))
      }
    }
  
    checkAll(event) {
  
      event.stopPropagation()
      this.array.clear()
      if (event.target.checked) {
        this.localArray.forEach((element) => {
          this.array.push(this.fb.control(element))
        })
      }
    }
  
    displayDropDown(event) {
  
      event.stopPropagation()
      this.display = !this.display
      this.displayChange.emit(this.display)
  
    }

}
