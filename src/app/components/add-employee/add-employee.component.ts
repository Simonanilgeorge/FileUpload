import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  providers:[DatePipe]
})

export class AddEmployeeComponent implements OnInit {
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




  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute,private datePipe:DatePipe) { }


  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)

    this.checkUpdate();

    this.getDropDown();
    this.userForm = this.fb.group({
      inputs: this.fb.group({
        doj: ["", Validators.required],
        empcode: ["", Validators.required],
        name: ["", Validators.required],
        task: this.fb.array([], Validators.required),
        client: ["", Validators.required],
        search: ["", Validators.required],
        id: [""],
        shift: ["", Validators.required],
        productionStatus: ["", Validators.required],
        trainingDuration: ["", Validators.required],
        plannedOutOfReviewDate: [""],
        username: [sessionStorage.getItem('user')]
      })
    });

  }

  get plannedOutOfReviewDate() {
    return this.inputs.get("plannedOutOfReviewDate")
  }

  get productionStatus() {
    return this.inputs.get("productionStatus")
  }
  get shift() {
    return this.inputs.get("shift")
  }

  get trainingDuration() {
    return this.inputs.get("trainingDuration")
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

    const id = sessionStorage.getItem("employeeID")
    if (id) {
      this.update = true;
      this.getSingleEmployee();
    }
    else {
      this.update = false;

    }

  }


  onSubmit() {

    console.log(this.userForm.getRawValue())
    // check if all compulsory fields are filled
    if (this.userForm.status === "INVALID") {

      this.showToastMessage("Please fill all the fields");
      return;
    }


    return;

    // send the form
    this.empReportService.addEmployee(this.userForm.value).subscribe((res) => {

      this.showToastMessage(res.response)
      this.ngOnInit();
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
      res = JSON.parse(res);

      this.inputs.patchValue(res[0]);

    }, (err) => {
      console.log(err.message);
    })
  }

  display() {
    this.displayBoolean = !this.displayBoolean;

  }
  add(e, i) {
    // this.displayBoolean = !this.displayBoolean;
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
    console.log(`current value for task is ${this.task.getRawValue()}`)



  }

  changeClientOptions(event) {

    console.log(`current value for task is ${this.task.getRawValue()}`)
    this.isActive = true
    setTimeout(() => {
      this.isActive = false
    }, 5)
    this.task.clear()
    this.Tasklist = this.dropDownList[this.inputs.value.client];

    console.log(`current value for task is ${this.task.getRawValue()}`)


    console.log(`current value for isActive is ${this.isActive}`)


  }

  getDropDown() {

    this.empReportService.getDropDownList().subscribe((res) => {
      this.dropDownList = res;

      this.ClientList = this.dropDownList.Client;

    }, (err) => {
      console.log(err.message)
    })

  }


  getName(data) {

    console.log(data)
    this.trainingDuration.setValue(data);
  }

  counter(number: number) {

    let array = [];
    for (let i = 1; i <= number; i++) {
      array.push(`Week ${i}`)
    }
    return array;
  }

  calculatePlannedDate() {
    if (this.trainingDuration.value != "" && this.doj.value != "") {
      // calculate planned date
      let days = this.trainingDuration.value.split(" ")[1] * 7;
      let result = new Date(this.doj.value);
      result.setDate(result.getDate() + days);

      this.plannedOutOfReviewDate.setValue(this.datePipe.transform(result,"yyyy-MM-dd"))


    }
    else {
      return;
    }
  }



}

