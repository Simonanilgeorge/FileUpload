import { Component, OnInit } from '@angular/core';

import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { DatePipe, Location } from '@angular/common';
@Component({
  selector: 'app-employeesendreport',
  templateUrl: './employeesendreport.component.html',
  styleUrls: ['./employeesendreport.component.css'],
  providers: [DatePipe]
})
export class EmployeesendreportComponent implements OnInit {

  delete = false;
  modalBoolean = false
  dataToBeDeleted
  displayBoolean = false;
  update: Boolean = false;
  message;
  toastStatus
  toast: Boolean = false;
  public notValid: boolean = false;
  flag = true;
  userForm: FormGroup;
  update_id = { id: sessionStorage.getItem("updateID") }
  dropDownList: any;
  ClientList: string[];
  Tasklist: string[];
  Processlist: string[];
  stateList: string[];
  statusList: string[];
  temp: any;
  final: any;
  NonProdDisabled = false;


  myDate = new Date();

  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute, private datePipe: DatePipe, private location: Location) { }

  ngOnInit(): void {

    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole("EmployeesendreportComponent")
    this.getDropDown();

    this.userForm = this.fb.group({
      inputs: this.fb.group({
        date: [this.datePipe.transform(this.myDate, 'yyyy-MM-dd')],
        orderNumber: ["", Validators.required],
        Client: ["", Validators.required],
        Task: ["", Validators.required],
        Process: [""],
        state: ["--Select--", Validators.required],
        startTime: ["", Validators.required],
        endTime: ["", Validators.required],
        totalTime: [""],
        username: [sessionStorage.getItem('user')],
        status: ["", Validators.required],
        account_name: sessionStorage.getItem('account_name'),
        id: [""]
      })
    });

  }


  get state() {
    return this.inputs.get("state");
  }

  get status() {
    return this.inputs.get("status");
  }

  get orderNumber() {
    return this.inputs.get("orderNumber")
  }

  get startTime() {
    return this.inputs.get("startTime");
  }
  get endTime() {
    return this.inputs.get("endTime");
  }
  get Client() {
    return this.inputs.get("Client");
  }

  get totalTime() {
    return this.inputs.get("totalTime")
  }
  get inputs() {
    return this.userForm.get("inputs");
  }

  get Task() {
    return this.inputs.get("Task")
  }
  get Process() {
    return this.inputs.get("Process")
  }
  changeClientOptions(event) {


    this.Task.setValue("");
    this.Process.setValue("");


    this.checkNonProd();

    this.Tasklist = this.dropDownList[this.inputs.value.Client];
    this.Processlist = null


  }

  changeTaskOptions(event) {
    this.final = null
    this.Process.setValue("");
    this.final = this.inputs.value.Client + this.inputs.value.Task
    this.Processlist = this.dropDownList[this.final]
  }

  onSubmit() {



    this.orderNumber.setValue(this.orderNumber.value.trim())
    if (this.Client.value == "NonProd") {
      // this.orderNumber.setValue(" ");
      this.state.setValue("");
      // this.status.setValue("");
    }
    // check if all compulsory fields are filled
    if (this.userForm.status === "INVALID" || this.state.value == "--Select--") {

      this.showToastMessage("Please fill all the fields", "warning");
      return;
    }
    if (this.Client.value != "NonProd" && this.Process.value == "") {
      this.showToastMessage("Please enter a value for Process", "warning")
      return;
    }
    // get the total time
    let result = this.getTotalTime();
    // check if start time and end time are same
    if (result === 0) {

      this.showToastMessage("Please select the correct time", "warning");
      return;
    }
    else {
      this.totalTime.setValue(Math.abs(result));
    }


    // send the form
    this.empReportService.sendReport(this.userForm.getRawValue()).subscribe((res) => {

      this.showToastMessage("Success", "success")
      this.userForm.enable()
      this.NonProdDisabled = false
      if (this.update) {
        setTimeout(() => {
          this.location.back()
        }, 1000);

      }
      this.ngOnInit();
    }, (err) => {
      console.log(err.message)
      this.showToastMessage("Failed", "error")
    })

  }


  getTotalTime() {

    let time1 = this.inputs.value.startTime;
    let time2 = this.inputs.value.endTime;
    time1 = time1.split(":").map(Number)
    time2 = time2.split(":").map(Number)

    // time taken to complete order is more than one day
    if (time1[0] > time2[0] || time1[0] == time2[0] && time1[1] > time2[1]) {
      time2[0] = time2[0] + 24;

    }
    let hour = Math.abs(time2[0]) - time1[0];
    let minute = time2[1] - time1[1];

    let result = hour * 60 + minute


    return result;
  }

  getDropDown() {

    this.empReportService.getDropDownList().subscribe((res) => {
      this.dropDownList = res;

      this.ClientList = this.dropDownList.Client;
      this.statusList = this.dropDownList.Status;
      this.stateList = this.dropDownList.States;
      // get single status for update
      const id = sessionStorage.getItem('updateID');
      const deleteID = sessionStorage.getItem('deleteID')
      if (id) {
        this.update = true;


        this.getSingleStatus();

      }
      else if (deleteID) {
        this.userForm.disable()
        this.displayBoolean = false;
        this.delete = true;
        this.update_id = { id: deleteID }
        this.getSingleStatus();
      }
      else {
        this.update = false;
        this.delete = false
      }
    }, (err) => {
      console.log(err.message)
    })
  }

  showToastMessage(message, status) {
    this.message = message;
    this.toast = true;
    this.toastStatus = `${status}`
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }


  // call singleReport for update
  getSingleStatus() {

    this.empReportService.getSingleReport(this.update_id).subscribe((res) => {

      sessionStorage.removeItem("updateID");
      sessionStorage.removeItem("deleteID")
      res = JSON.parse(res);
      this.Tasklist = this.dropDownList[res[0].Client];

      let temp = res[0].Client + res[0].Task

      this.Processlist = this.dropDownList[temp]

      this.inputs.patchValue(res[0]);
      if (res[0].Client == "NonProd") {
        this.checkNonProd();
      }

    }, (err) => {
      console.log(err.message);
    })
  }



  deleteStatus() {
    this.modalBoolean = false;
    this.empReportService.deleteEmployeeReport(this.userForm.value).subscribe((res) => {

      this.showToastMessage(res.status, "success")
      setTimeout(() => {
        this.location.back()
      }, 1000)
    }, (err) => {
      console.log(err.message)
    })

  }
  display() {

    if (!this.delete && this.Client.value != "NonProd") {
      this.displayBoolean = !this.displayBoolean;
    }


  }

  getName(data) {

    this.state.setValue(data);
  }



  // open on delete button click methods
  showModal() {


    // data.username = sessionStorage.getItem('user')


    this.modalBoolean = true;
    this.dataToBeDeleted = this.userForm.getRawValue();

  }

  closeModal() {

    this.modalBoolean = false;
    this.dataToBeDeleted = null;
    this.goBack()
  }
  goBack() {
    this.location.back()
  }

  checkNonProd() {
    if (this.Client.value == "NonProd") {

      this.orderNumber.disable()
      this.status.disable()
      this.Process.disable()
      this.state.disable()
      this.displayBoolean = false;
      this.NonProdDisabled = true
      this.orderNumber.setValue(" ")
      this.status.setValue("")
      this.state.setValue("--Select--")

    }
    else {
      this.NonProdDisabled = false
      this.userForm.enable()


    }

  }

}