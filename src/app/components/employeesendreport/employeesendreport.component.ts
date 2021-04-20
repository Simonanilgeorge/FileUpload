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


  public notValid: boolean = false;
  flag = true;
  userForm: FormGroup;
  output: FormGroup = this.fb.group({
    inputs: this.fb.array([])
  });
  dropDownList: any;
  Client: string[];
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
      date: [""],
      orderNumber: ["", Validators.required],
      Client: [""],
      Task: [""],
      Process: [""],
      state: [""],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
      totalTime: [""],
      username: [sessionStorage.getItem('user')],
      status: [""],
      account_name: sessionStorage.getItem('account_name'),

    });
    this.stateList = ["AN", "FL", "AZ", "BL", "AB", "CZ"];
    this.getDropDown();
  }
  changeClientOptions(event) {

    this.userForm.controls['Task'].setValue("");
    this.userForm.controls['Process'].setValue("");
    this.temp = null
    this.Tasklist = this.dropDownList[event.target.value];
    this.temp = event.target.value
    this.Processlist = null


  }

  changeTaskOptions(event) {

    this.final = null
    this.userForm.controls['Process'].setValue("");
    this.final = this.temp + event.target.value
    this.Processlist = this.dropDownList[this.final]
  }


  get inputs() {
    return this.output.get("inputs") as FormArray;
  }

  onSubmit() {

    let time1 = this.userForm.value.startTime;
    let time2 = this.userForm.value.endTime;
    time1 = time1.split(":").map(Number)
    time2 = time2.split(":").map(Number)
    let hour = time2[0] - time1[0];
    let minute = time2[1] - time1[1];
    let result = hour * 60 + minute

    this.userForm.controls["totalTime"].setValue(result);

    console.log(this.userForm.value)


    this.empReportService.sendReport(this.userForm.value).subscribe((res) => {
      this.flag = false;
      setTimeout(() => {
         this.flag = true;
      }, 1000);
      this.ngOnInit();
    }, (err) => {
      console.log(err.message)
    })

  }

  getDropDown() {

    this.empReportService.getDropDownList().subscribe((res) => {


      this.dropDownList = res;
      this.Client = this.dropDownList.Client;
      this.statusList = this.dropDownList.Status;

    }, (err) => {
      console.log(err.message)
    })

  }

}