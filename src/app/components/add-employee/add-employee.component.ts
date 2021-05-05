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
  update: Boolean=false;
  message = "Success";
  toast: Boolean = false;
  public notValid: boolean = false;
  flag = true;
  userForm: FormGroup;
  update_id = { id: sessionStorage.getItem("updateID") }
  dropDownList: any;
  ClientList: string[]=["ASK","DT","TW"];
  Tasklist: string[];
  Processlist: string[];
  temp: any;
  final: any;
  stateList: string[];
  statusList: string[];
  

  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)

    this.userForm = this.fb.group({
      inputs: this.fb.group({
        doj:["",Validators.required],
        empcode:["",Validators.required],
        name:["",Validators.required],
        task:["",Validators.required],
        client:["",Validators.required],
        search:["",Validators.required],
        id: [""]
      })
    });
  }



get doj(){
  return this.inputs.get("doj");
}

get empcode(){
  return this.inputs.get("empcode");
}

  get name() {
    return this.inputs.get("name")
  }

  get task() {
    return this.inputs.get("task");
  }
  get client() {
    return this.inputs.get("client");
  }
  get search() {
    return this.inputs.get("search");
  }

  get inputs() {
    return this.inputs.get("inputs")
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

      this.showToastMessage("Success")
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
  getSingleStatus() {

    this.empReportService.getSingleReport(this.update_id).subscribe((res) => {
      sessionStorage.removeItem("updateID");
      res = JSON.parse(res);      
      this.inputs.patchValue(res[0]);

    }, (err) => {
      console.log(err.message);
    })
  }

}
