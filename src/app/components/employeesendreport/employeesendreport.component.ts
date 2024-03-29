import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { DatePipe, Location } from '@angular/common';
import { identifierModuleUrl } from '@angular/compiler';
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
  order_id = { id: null }
  dropDownList: any;
  ClientList: string[];
  Tasklist: string[];
  Processlist: string[];
  stateList: string[];
  statusList: string[];
  countyList = []
  modeList = ["Call", "Email", "Fax"]
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
        client: ["", Validators.required],
        task: ["", Validators.required],
        process: ["", Validators.required],
        state: ["", Validators.required],
        mode: [""],
        parcels: [1, Validators.required],
        exception: ["No", Validators.required],
        comments: [""],
        county: ["", Validators.required],
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
  get mode() {
    return this.inputs.get("mode")
  }
  get parcels() {
    return this.inputs.get("parcels")
  }
  get exception() {
    return this.inputs.get("exception")
  }
  get comments() {
    return this.inputs.get("comments")
  }
  get county() {
    return this.inputs.get("county")
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
  get client() {
    return this.inputs.get("client");
  }
  get totalTime() {
    return this.inputs.get("totalTime")
  }
  get inputs() {
    return this.userForm.get("inputs");
  }
  get task() {
    return this.inputs.get("task")
  }
  get process() {
    return this.inputs.get("process")
  }
  changeClientOptions() {
    this.task.setValue("");
    this.process.setValue("");
    this.mode.setValue("")
    this.Tasklist = this.dropDownList[this.inputs.value.client];
    this.disableOnClientValues()
    this.Processlist = null
    this.getState()
  }
  changeTaskOptions() {
    this.final = null
    this.process.setValue("");
    // test
    this.final = this.inputs.value.client + this.inputs.value.task
    this.Processlist = this.dropDownList[this.final]
    this.getState()
  }
  getState() {
    // reset all value of state list and county list so that previous values wont get populated
    // state needs to be reset everytime
    this.stateList = []
    this.state.setValue("")
    // note only if client is TW county list is set to null
    // warning previous values can exist in county list (but all is set in disable on client value function , if client is TW value gets overrided from previous function)
    if (this.client.value == "TW") {
      this.county.setValue("")
      this.countyList = []
    }
    if (this.client.valid && this.task.valid && this.process.valid) {

      this.empReportService.getStateAndCounty(this.userForm.getRawValue()).subscribe((res) => {
        console.log(res)
        // assign to stateList and countyList
        this.stateList = res.state
        // this.countyList=res.county
      }, (err) => {
        console.log(err.message)
      })
    }
  }
  getCounty() {
    // for all other client values county should be disabled and value should be ALL (the value is set in disableOnclientValues() function)
    if (this.client.value == "TW") {
      this.county.setValue("")
      this.countyList = []
    }
    if (this.client.valid && this.task.valid && this.process.valid && this.state.valid) {

      this.empReportService.getStateAndCounty(this.userForm.getRawValue()).subscribe((res) => {

        // assign to stateList and countyList
        this.countyList = res.county
      }, (err) => {
        console.log(err.message)
      })
    }
  }
  // disable or enable fields based on client value
  disableOnClientValues() {
    // county will be set to all for any value of client
    if (this.client.value == "ASK") {
      this.mode.enable()
      this.parcels.enable()
    }
    else {
      this.mode.setValue("")
      this.parcels.disable()
      this.mode.disable()
      this.parcels.setValue(1)
    }
    // for county
    if (this.client.value == "TW") {
      this.county.enable()
    }
    else {
      this.county.setValue("ALL")
      this.countyList = ["ALL"]
      this.county.disable()
    }
  }
  setParcelValue() {
    if (this.parcels.value > 99 || this.parcels.value < 0 || this.parcels.value == 0) {
      this.parcels.setValue(1)
    }
    else {
      return
    }
  }
  onSubmit() {
    this.orderNumber.setValue(this.orderNumber.value.trim())
    // check if all compulsory fields are filled
    if (!this.userForm.valid) {
      this.showToastMessage("Please fill all the fields", "warning");
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
      // this.NonProdDisabled = false
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
    if (this.startTime.valid && this.endTime.valid) {
      let startTimeMin, endTimeMin, totalTime
      let time1 = this.inputs.value.startTime;
      let time2 = this.inputs.value.endTime;
      time1 = time1.split(":").map(Number)
      time2 = time2.split(":").map(Number)
      startTimeMin = time1[0] * 60 + time1[1]
      endTimeMin = time2[0] * 60 + time2[1]
      totalTime = endTimeMin - startTimeMin
      if (totalTime < 0) {
        if (!(time1[0] >= 12 && time2[0] < 12)) {
          this.showToastMessage("start time must be less than end time", "warning")
          this.startTime.setValue("")
          this.endTime.setValue("")
        }
      }
      // time taken to complete order is more than one day
      if (time1[0] > time2[0] || time1[0] == time2[0] && time1[1] > time2[1]) {
        time2[0] = time2[0] + 24;
      }
      let hour = Math.abs(time2[0]) - time1[0];
      let minute = time2[1] - time1[1];
      let result = hour * 60 + minute
      return result;
    }
    else {
      return
    }
  }
  getDropDown() {
    this.empReportService.getDropDownList().subscribe((res) => {
      this.dropDownList = res;
      this.ClientList = this.dropDownList.Client;
      this.statusList = this.dropDownList.Status;
      // get single status for update
      this.route.params.subscribe(params => {
        switch (Object.keys(params)[0]) {
          // call singlestatus function to populate fields for update
          case "editid":
            this.update = true;
            this.order_id.id = params.editid
            this.orderNumber.disable()
            this.getSingleStatus();
            break;
          case "deleteid":
            this.displayBoolean = false;
            this.delete = true;
            this.order_id.id = params.deleteid
            this.getSingleStatus();
            this.userForm.disable()
            break;
          default: this.update = false;
            this.delete = false
        }
      });

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
    this.empReportService.getSingleReport(this.order_id).subscribe((res) => {
      try {
        res = JSON.parse(res);
        this.Tasklist = this.dropDownList[res[0].client];
        let temp = res[0].client + res[0].task
        this.Processlist = this.dropDownList[temp]
        // get state and list with client,process,task values
        // get countylist with state values
        this.inputs.patchValue(res[0]);
        this.empReportService.getStateAndCounty(this.userForm.getRawValue()).subscribe((res) => {

          // assign to stateList and countyList
          this.countyList = res.county
          this.stateList = res.state
        }, (err) => {
          console.log(err.message)
        })
        if (this.update) {
          this.disableOnClientValues()
        }
      }
      catch {
        this.location.back()
      }
    }, (err) => {
      console.log(err.message);
    })
  }
  deleteStatus() {
    this.modalBoolean = false;
    this.empReportService.deleteEmployeeReport(this.userForm.getRawValue()).subscribe((res) => {
      this.showToastMessage(res.status, "success")
      setTimeout(() => {
        this.location.back()
      }, 1000)
    }, (err) => {
      console.log(err.message)
    })
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
}
