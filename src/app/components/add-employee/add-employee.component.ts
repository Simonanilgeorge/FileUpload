import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})

export class AddEmployeeComponent implements OnInit {
  update: Boolean = false;
  message = null;
  toast: Boolean = false;
  userForm: FormGroup;
  employeeID = { id: sessionStorage.getItem("employeeID") }
  dropDownList: any;
  ClientList: string[] = ["ASK", "DT", "TW"];




  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)

    this.checkUpdate();


    this.userForm = this.fb.group({
      inputs: this.fb.group({
        doj: ["", Validators.required],
        empcode: ["", Validators.required],
        name: ["", Validators.required],
        task: ["", Validators.required],
        client: ["", Validators.required],
        search: ["", Validators.required],
        id: [""]
      })
    });

  }



  get doj() {
    return this.userForm.get("doj");
  }

  get empcode() {
    return this.userForm.get("empcode");
  }

  get name() {
    return this.userForm.get("name")
  }

  get task() {
    return this.userForm.get("task");
  }
  get client() {
    return this.userForm.get("client");
  }
  get search() {
    return this.userForm.get("search");
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

    console.log(this.userForm.value)
    // check if all compulsory fields are filled
    if (this.userForm.status === "INVALID") {

      this.showToastMessage("Please fill all the fields");
      return;
    }

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
      console.log(res);
      this.inputs.patchValue(res[0]);

    }, (err) => {
      console.log(err.message);
    })
  }

}
