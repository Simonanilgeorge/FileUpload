import { Component, OnInit } from '@angular/core';

import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
@Component({
  selector: 'app-employeesendreport',
  templateUrl: './employeesendreport.component.html',
  styleUrls: ['./employeesendreport.component.css']
})
export class EmployeesendreportComponent implements OnInit {


  message = "Success";
  toast: Boolean = false;
  public notValid: boolean = false;
  flag = true;
  userForm: FormGroup;

  dropDownList: any;
  ClientList: string[];
  Tasklist: string[];
  Processlist: string[];
  temp: any;
  final: any;
  stateList: string[];
  statusList: string[];

  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {

    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)
    this.userForm = this.fb.group({
      inputs: this.fb.group({
        date: ["",Validators.required],
        orderNumber: ["", Validators.required],
        Client: ["", Validators.required],
        Task: ["", Validators.required],
        Process: [""],
        state: ["", Validators.required],
        startTime: ["", Validators.required],
        endTime: ["", Validators.required],
        totalTime: [""],
        username: [sessionStorage.getItem('user')],
        status: ["",Validators.required],
        account_name: sessionStorage.getItem('account_name'),
      })


    });
    this.stateList = ["AN", "FL", "AZ", "BL", "AB", "CZ"];
    this.getDropDown();
  }

get Client(){
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


    this.temp = null
    this.Tasklist = this.dropDownList[event.target.value];
    this.temp = event.target.value
    this.Processlist = null


  }

  changeTaskOptions(event) {

    this.final = null
    this.Process.setValue("");
    this.final = this.temp + event.target.value
    this.Processlist = this.dropDownList[this.final]
  }



  onSubmit() {

    console.log(this.userForm.value)

    console.log(this.Client);

    // check if all compulsory fields are filled
    if (this.userForm.status === "INVALID") {
     
      this.showToastMessage("Please fill all the fields");
      return;
    }
    if(this.Client.value!="NonProd" && this.Process.value==""){
      this.showToastMessage("Please enter a value for Process")
      return;
    }
    
    // get the total time
    let result = this.getTotalTime();
    console.log(result);

    // check if start time and end time are same
    if (result === 0) {
      
      this.showToastMessage("Please select the correct time");
      return;
    }
    else {
      this.totalTime.setValue(Math.abs(result));
    }


    console.log(this.userForm.value);
// send the form
    this.empReportService.sendReport(this.userForm.value).subscribe((res) => {

      this.showToastMessage("Success")
      this.ngOnInit();
    }, (err) => {
      console.log(err.message)
    })

  }


  getTotalTime() {
    let time1 = this.inputs.value.startTime;
    let time2 = this.inputs.value.endTime;
    time1 = time1.split(":").map(Number)
    time2 = time2.split(":").map(Number)
    let hour = time2[0] - time1[0];
    let minute = time2[1] - time1[1];
    let result = hour * 60 + minute
    return result
  }

  getDropDown() {

    this.empReportService.getDropDownList().subscribe((res) => {
      this.dropDownList = res;
      this.ClientList = this.dropDownList.Client;
      this.statusList = this.dropDownList.Status;

    }, (err) => {
      console.log(err.message)
    })

  }

  showToastMessage(message){
   this.message=message;
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }

}