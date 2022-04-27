import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { DatePipe, Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  providers: [DatePipe]
})
export class AddEmployeeComponent implements OnInit {
  modalBoolean: Boolean = false
  dataToBeDeleted;
  delete = false;
  roleList
  valid: boolean = true;

  update: Boolean = false;
  message = null;
  toast: Boolean = false;
  toastStatus;
  employeeID = { id: null }
  dropDownList: any;
  StateList;
  Processlist
  ClientList: string[];
  countyList = []
  Tasklist = []
  roles = []
  final: any

  userForm = this.fb.group({
    inputs: this.fb.group({
      doj: [{ value: '', disabled: false }, Validators.required],
      empcode: [{ value: '', disabled: false }, Validators.required],
      name: [{ value: '', disabled: false }, Validators.required],
      task: [{ value: '', disabled: false }, Validators.required],
      process: [{ value: '', disabled: false }, Validators.required],
      state: [{ value: '', disabled: false }, Validators.required],
      county: [{ value: 'ALL', disabled: false }, Validators.required],
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
      role: [{ value: "", disabled: false }, Validators.required],
      username: [sessionStorage.getItem('user')]
    })
  });

  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute, private datePipe: DatePipe, private elem: ElementRef, private location: Location) { }
  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.roles = CryptoJS.AES.decrypt(sessionStorage.getItem("role"),sessionStorage.getItem("token")).toString(CryptoJS.enc.Utf8).split(",")
    this.loginService.navigateByRole("AddEmployeeComponent")
    this.getDropDown();
  }
  get id() {
    return this.inputs.get("id")
  }
  get process() {
    return this.inputs.get("process")
  }
  get state() {
    return this.inputs.get("state")
  }

  get county() {
    return this.inputs.get("county")
  }
  get role() {
    return this.inputs.get("role")
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
    return this.inputs.get("task")
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
  // get keys() {
  //   return [this.process, this.state, this.task, this.search, this.client, this.delay_reason, this.production_status]
  // }
  get username() {
    return this.inputs.get("username")
  }
  // check if operation is update or delete
  checkUpdate() {
    this.route.params.subscribe((params) => {
      switch (Object.keys(params)[0]) {
        case "editid":
          this.update = true;
          this.delete = false
          this.employeeID.id = params.editid
          this.empcode.disable()
          this.name.disable()
          this.doj.disable()
          this.training_duration.disable()
          this.getSingleEmployee();
          break;
        case "deleteid":
          this.userForm.disable()
          this.employeeID.id = params.deleteid;
          this.delete = true
          this.update = false
          this.getSingleEmployee();
          break
        default:
          this.update = false;
          this.delete = false
          break;
      }
    })
  }
  // submit function for add and update
  onSubmit() {
    this.name.setValue(this.name.value.trim())
    this.empcode.setValue(this.empcode.value.trim())
    if (!this.valid) {
      this.showToastMessage("actual out of review date cannot be before planned out of review date", "warning")
      return
    }
    // check if all compulsory fields are filled
    if (!this.userForm.valid) {
      this.showToastMessage("Please fill all the fields", "warning");
      return;
    }
    // send the form
    this.empReportService.addEmployee(this.userForm.getRawValue()).subscribe((res) => {
      if (res.response === "Success") {
        this.showToastMessage(res.response, "success")
        // enable form for add employee
        if (this.update) {
          setTimeout(() => {
            this.location.back()
          }, 1000);
        }
        this.userForm.enable()
        this.delay_review_duration.disable()
        this.planned_out_of_review_date.disable()
        this.resetForm()

      }
      else {
        this.showToastMessage(res.response, "warning")
      }
    }, (err) => {
      console.log(err.message)
      this.showToastMessage("Failed", "error")
    })
  }
  // toast message
  showToastMessage(message, status) {
    this.message = message;
    this.toastStatus = `${status}`
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }
  // call singleReport for update
  getSingleEmployee() {
    this.empReportService.getSingleEmployee(this.employeeID.id).subscribe((res) => {
      try {
        res = JSON.parse(res);
        if (!this.roles.includes('Super Admin') && res[0].role == "Super Admin") {
          this.goBack()
          return
        }
        this.Tasklist = this.dropDownList[res[0].client];
        let temp = res[0].client + res[0].task
        this.Processlist = this.dropDownList[temp]
        this.inputs.patchValue(res[0]);
      }
      catch {
        this.location.back()
      }

    }, (err) => {
      console.log(err.message);
    })
  }

  // function called when client value changed
  changeClientOptions() {

    this.task.setValue("")
    this.process.setValue("")
    this.Tasklist = this.dropDownList[this.inputs.value.client];
    this.Processlist = []
  }
  // function called when task value is changed
  changeTaskOptions() {
    this.final = null
    this.process.setValue("");
    this.final = this.client.value + this.task.value
    this.Processlist = this.dropDownList[this.final]
  }
  // get dropdown array
  getDropDown() {
    this.empReportService.getDropDownList().subscribe((res) => {
      this.dropDownList = res;

      this.StateList = this.dropDownList.States
      this.countyList = this.dropDownList.County
      this.ClientList = this.dropDownList.Client;
      if (this.roles.includes('Super Admin')) {
        this.roleList = res.role
      }
      else {
        // this.roleList = this.removeItem(res.role, 'Super Admin');
        this.roleList = res.role.filter((role) => {
          return role != "Super Admin"
        })
      }

      this.checkUpdate();
    }, (err) => {
      console.log(err.message)
    })
  }

  // set number of weeks
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
      this.valid = true
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

    }
    else {
      this.valid = false;
      this.showToastMessage("actual out of review date cannot be before planned out of review date", "warning")
      return
    }
  }

  // open on delete button click methods
  showModal() {
    this.modalBoolean = true;
    this.dataToBeDeleted = this.userForm.getRawValue();
  }
  // function to close modal box
  closeModal() {
    this.modalBoolean = false;
    this.dataToBeDeleted = null;
  }
  // function called on delete
  deleteEmployee(data) {
    this.modalBoolean = false;
    this.empReportService.deleteEmployee(data).subscribe((res) => {
      this.showToastMessage("Deleted successfully", "success")
      setTimeout(() => {
        this.location.back()
      }, 1000)
      // test
      this.resetForm()
      // this.ngOnInit();
    }, (err) => {
      this.showToastMessage("Deletion failed", "error")
      console.log(err.message)
    })
  }
  goBack() {
    this.location.back()
  }
  resetForm() {
    this.doj.setValue("")
    this.empcode.setValue("")
    this.name.setValue("")
    this.task.setValue("")
    this.process.setValue("")
    this.state.setValue("")
    this.client.setValue("")
    this.search.setValue("")
    this.id.setValue("")
    this.shift.setValue("")
    this.production_status.setValue("")
    this.training_duration.setValue("")
    this.planned_out_of_review_date.setValue("")
    this.actual_out_of_review_date.setValue("")
    this.delay_reason.setValue("No issue")
    this.delay_review_duration.setValue("0 days")
    this.role.setValue("")
    this.username.setValue(sessionStorage.getItem("user"))
    this.Tasklist = []
    this.Processlist = []
  }
}
