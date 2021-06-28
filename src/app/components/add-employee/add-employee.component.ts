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
  providers: [DatePipe]
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

  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)


    this.getDropDown();
    this.checkUpdate();
    this.userForm = this.fb.group({
      inputs: this.fb.group({
        doj: [{ value: '', disabled: this.update }, Validators.required],
        empcode: [{ value: '', disabled: this.update }, Validators.required],
        name: [{ value: '', disabled: this.update }, Validators.required],
        task: this.fb.array([]),
        client: [{ value: '', disabled: this.update }, Validators.required],
        search: [{ value: '', disabled: this.update }, Validators.required],
        id: [""],
        shift: ["",Validators.required],
        production_status: ["",Validators.required],
        training_duration: [{ value: '', disabled: this.update }, Validators.required],
        planned_out_of_review_date: [{ value: '', disabled: true }, Validators.required],
        actual_out_of_review_date: ["",Validators.required],
        delay_reason: ["",Validators.required],
        delay_review_duration: [{ value: '0', disabled: true }, Validators.required],
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


    // send the form
    this.empReportService.addEmployee(this.userForm.getRawValue()).subscribe((res) => {

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
      console.log(res)
      // this.Tasklist = this.dropDownList[res[0].client];
      this.inputs.patchValue(res[0]);

      res[0].task.forEach((task) => {
        this.task.push(this.fb.control(task))
      })

      console.log("after patch value")
      console.log(this.inputs.value)
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
      // this.checkUpdate();

    }, (err) => {
      console.log(err.message)
    })

  }


  getName(data) {

    console.log(data)
    this.training_duration.setValue(data);
  }

  counter(number: number) {

    let array = [];
    for (let i = 1; i <= number; i++) {
      array.push(`${i} Week`)
    }
    return array;
  }

  calculatePlannedDate() {
    if (this.training_duration.value != "" && this.doj.value != "") {
      // calculate planned date
      let days = this.training_duration.value.split(" ")[0] * 7;
      let result = new Date(this.doj.value);
      console.log(result)
      result.setDate(result.getDate() + days);
      console.log(result)

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

    if (resultDate > 0) {

      // to display in months and days
      let result = Math.floor(resultDate / 30);
      if (result == 0) {

        this.delay_review_duration.setValue(`${resultDate} days`)
      }
      else {

        let days = resultDate % 30;
        this.delay_review_duration.setValue(`${result} Month ${days} days`)

      }

      // number of days only
      // this.delay_review_duration.setValue(`${result} days`)
    }
    else {
      alert("actual out of review date cannot be before planned out of review date")
      return
    }

  }

}

