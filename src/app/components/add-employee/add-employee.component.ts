import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  providers: [DatePipe]
})

export class AddEmployeeComponent implements OnInit {

  @ViewChild('myDiv') myDiv: ElementRef;

  modalBoolean: Boolean = false
  dataToBeDeleted;
  delete = false;
  // nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  valid: boolean = true;
  isActive: boolean = false;
  update: Boolean = false;
  message = null;
  toast: Boolean = false;
  userForm: FormGroup;
  employeeID = { id: sessionStorage.getItem("employeeID") }
  dropDownList: any;
  displayBoolean = false;
  ClientList: string[];
  Tasklist = []


  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute, private datePipe: DatePipe, private elem: ElementRef) { }

  ngOnInit(): void {

    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.getDropDown();

    this.userForm = this.fb.group({
      inputs: this.fb.group({
        doj: [{ value: '', disabled: false }, Validators.required],
        empcode: [{ value: '', disabled: false }, Validators.required],
        name: [{ value: '', disabled: false }, Validators.required],
        task: this.fb.array([], Validators.required),
        client: [{ value: '', disabled: false }, Validators.required],
        search: [{ value: '', disabled: false }, Validators.required],
        id: [""],
        shift: ["", Validators.required],
        production_status: ["", Validators.required],
        training_duration: [{ value: '', disabled: false }, Validators.required],
        planned_out_of_review_date: [{ value: '', disabled: true }, Validators.required],
        actual_out_of_review_date: ["", Validators.required],
        delay_reason: ["No issue", Validators.required],
        delay_review_duration: [{ value: '0 days', disabled: true }, Validators.required],
        username: [sessionStorage.getItem('user')]
      })
    });
  }

  get delay_reason() {
    return this.inputs.get("delay_reason")

  }
  get delay_review_duration() {
    return this.inputs.get("delay_review_duration");
  }

  get actual_out_of_review_date() {
    return this.inputs.get("actual_out_of_review_date")
  }
  get planned_out_of_review_date() {
    return this.inputs.get("planned_out_of_review_date")
  }

  get production_status() {
    return this.inputs.get("production_status")
  }
  get shift() {
    return this.inputs.get("shift")
  }

  get training_duration() {
    return this.inputs.get("training_duration")
  }

  get doj() {
    return this.inputs.get("doj");
  }

  get empcode() {
    return this.inputs.get("empcode");
  }

  get name() {
    return this.inputs.get("name")
  }

  get task() {
    return this.inputs.get("task") as FormArray
  }

  get client() {
    return this.inputs.get("client");
  }
  get search() {
    return this.inputs.get("search");
  }

  get inputs() {
    return this.userForm.get("inputs")
  }


  checkUpdate() {

    const deleteEmployee = sessionStorage.getItem("deleteEmployee")
    // doj empcode name training duration to be disabled on update
    const id = sessionStorage.getItem("employeeID")
    if (id) {
      this.update = true;
      this.empcode.disable()
      this.name.disable()
      this.doj.disable()
      this.training_duration.disable()
      this.getSingleEmployee();
    }
    else if (deleteEmployee) {
      this.userForm.disable()
      this.employeeID.id = deleteEmployee;
      this.delete = true
      this.getSingleEmployee();

    }
    else {
      this.update = false;

    }
  }


  onSubmit() {

    this.name.setValue(this.name.value.trim())
    this.empcode.setValue(this.empcode.value.trim())

    if (!this.valid) {
      this.showToastMessage("actual out of review date cannot be before planned out of review date")
      return
    }
    // check if all compulsory fields are filled
    if (this.userForm.status === "INVALID") {

      this.showToastMessage("Please fill all the fields");
      return;
    }




    // send the form
    this.empReportService.addEmployee(this.userForm.getRawValue()).subscribe((res) => {

      this.showToastMessage(res.response)
      if (res.response === "Success") {
        // enable form for add employee
        this.userForm.enable()
        this.delay_review_duration.disable()
        this.planned_out_of_review_date.disable()
        this.ngOnInit();



      }

    }, (err) => {
      console.log(err.message)
      this.showToastMessage("Failed")
    })

  }


  showToastMessage(message) {
    this.message = message;
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }


  // call singleReport for update
  getSingleEmployee() {

    this.empReportService.getSingleEmployee(this.employeeID.id).subscribe((res) => {
      sessionStorage.removeItem("employeeID");
      sessionStorage.removeItem("deleteEmployee")
      res = JSON.parse(res);

      // this.Tasklist = this.dropDownList[res[0].client];
      this.inputs.patchValue(res[0]);

      res[0].task.forEach((task) => {
        this.task.push(this.fb.control(task))
      })


      // to do => values inside task should be checked 
      console.log(this.userForm.getRawValue())

      this.Tasklist = this.dropDownList[this.inputs.value.client];
      console.log(this.task.value)
      setTimeout(() => {
        let checkbox = this.elem.nativeElement.querySelectorAll('.clickoutside')
        checkbox.forEach((check) => {
          if (this.task.value.includes(check.value) && !check.checked) {
            check.checked = true
          }
        })

      }, 1000)

    }, (err) => {
      console.log(err.message);
    })


  }
  display() {

    this.displayBoolean = !this.displayBoolean;

  }
  add(e, i) {

    // if(this.update){
    //   return;
    // }
    this.displayBoolean = !this.displayBoolean;

    if (e.target.checked) {
      this.task.push(this.fb.control(e.target.value))

      // console.log(this.task.getRawValue());
    }
    else if (!e.target.checked && this.task.getRawValue().includes(e.target.value)) {
      let index = this.task.getRawValue().findIndex((check) => {
        return e.target.value === check;

      })
      this.task.removeAt(index);

    }

  }

  changeClientOptions(event) {


    this.isActive = true
    setTimeout(() => {
      this.isActive = false
    }, 5)
    this.task.clear()
    this.Tasklist = this.dropDownList[this.inputs.value.client];
  }

  getDropDown() {

    this.empReportService.getDropDownList().subscribe((res) => {
      this.dropDownList = res;

      this.ClientList = this.dropDownList.Client;
      this.checkUpdate();
      // this.checkUpdate();

    }, (err) => {
      console.log(err.message)
    })

  }


  getName(data) {


    this.training_duration.setValue(data);
  }

  counter(number: number) {

    let array = [];
    array.push(`${1} Week`)
    for (let i = 2; i <= number; i++) {

      array.push(`${i} Weeks`)
    }
    return array;
  }

  calculatePlannedDate() {
    if (this.training_duration.value != "" && this.doj.value != "") {
      // calculate planned date
      let days = this.training_duration.value.split(" ")[0] * 7;
      let result = new Date(this.doj.value);

      result.setDate(result.getDate() + days);


      this.planned_out_of_review_date.setValue(this.datePipe.transform(result, "yyyy-MM-dd"))
      this.actual_out_of_review_date.setValue(this.datePipe.transform(result, "yyyy-MM-dd"))

    }
    else {
      return;
    }
  }


  calculatedelay_review_duration() {

    let endDate = new Date(this.actual_out_of_review_date.value).getTime();
    let startDate = new Date(this.planned_out_of_review_date.value).getTime();

    let resultDate = (endDate - startDate) / (1000 * 24 * 60 * 60)

    if (resultDate >= 0) {

      // to display in months and days
      this.valid = true
      let result = Math.floor(resultDate / 30);
      if (result == 0) {

        if (resultDate == 1) {
          this.delay_review_duration.setValue(`${resultDate} day`)
        }
        else {
          this.delay_review_duration.setValue(`${resultDate} days`)
        }

      }
      else {

        let days = resultDate % 30;
        if (days == 1) {
          this.delay_review_duration.setValue(`${result} Month ${days} day`)
        }
        else {
          this.delay_review_duration.setValue(`${result} Month ${days} days`)
        }


      }
      // number of days only
      // this.delay_review_duration.setValue(`${result} days`)
    }
    else {
      this.valid = false;
      this.showToastMessage("actual out of review date cannot be before planned out of review date")
      return
    }

  }


  // @HostListener('document:click', ['$event']) 
  clickOutside(e) {

    if (e.target.classList.contains("clickoutside") || e.target.classList.contains("checkbox") || e.target.classList.contains("dropdown") || e.target.classList.contains("dropdown-text") || e.target.classList.contains("parent") || e.target.classList.contains("p-clickoutside")) {
      // this.displayBoolean=true
      // console.log("if");
      return
    } else {
      // console.log("else");

      this.displayBoolean = false
      // this.displayBoolean=false
    }
  }

// open on delete button click methods
  showModal() {


  // data.username = sessionStorage.getItem('user')
  console.log("showModal function")

    this.modalBoolean = true;
    this.dataToBeDeleted = this.userForm.getRawValue();
    console.log(this.dataToBeDeleted)
  }

  closeModal() {

    this.modalBoolean = false;
    this.dataToBeDeleted = null;
  }

  deleteEmployee(data) {


    this.modalBoolean = false;
    this.empReportService.deleteEmployee(data).subscribe((res) => {

      this.showToastMessage("Deleted successfully")

      this.ngOnInit();
    }, (err) => {
      this.showToastMessage("Deletion failed")
      console.log(err.message)
    })

  }
}





