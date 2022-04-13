import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { DatePipe, Location } from '@angular/common';

@Component({
  selector: 'app-add-target',
  templateUrl: './add-target.component.html',
  styleUrls: ['./add-target.component.css'],
  providers: [DatePipe]
})
export class AddTargetComponent implements OnInit {
  update = false;
  delete = false;
  // toast variables
  toast: Boolean = false;
  toastStatus;
  message
  // modal variables
  modalBoolean = false
  dataToBeDeleted
  displayBoolean = false;
  dropDownList:any
  stateList=[]
  countyList=[]


  form = this.fb.group({
    Client: ["", Validators.required],
    Task: ["", Validators.required],
    Process: ["", Validators.required],
    State: ["ALL", Validators.required],
    County: ["ALL", Validators.required],
    Time: ["", Validators.required],
    band1: ["", Validators.required],
    band2: ["", Validators.required],
    band3: ["", Validators.required],
    price: ["", Validators.required],
    id: [""],
    username: [sessionStorage.getItem('user')],
  });
  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute, private datePipe: DatePipe, private location: Location) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole("AddTargetComponent")
    this.getDropDown()
    this.route.params.subscribe(params => {

      switch (Object.keys(params)[0]) {
        case "editid": this.update = true
          this.delete = false
          this.Client.disable()
          this.Process.disable()
          this.Task.disable()
          this.getSingleTarget(params.editid)
          break;
        case "deleteid": this.delete = true;
          this.update = false
          this.form.disable()
          this.getSingleTarget(params.deleteid)
          break;
        default: this.update = false;
          this.delete = false
      }
    });
  }
  get username(){
    return this.form.get("username")
  }

  get Client() {
    return this.form.get("Client")
  }
  get County() {
    return this.form.get("County")
  }
  get State() {
    return this.form.get("State")
  }
  get Task() {
    return this.form.get("Task")
  }
  get Process() {
    return this.form.get("Process")
  }
  get Time() {
    return this.form.get("Time")
  }
  get band1() {
    return this.form.get("band1")
  }
  get band2() {
    return this.form.get("band2")
  }
  get band3() {
    return this.form.get("band3")
  }
  get price() {
    return this.form.get("Client")
  }
  get id() {
    return this.form.get("id")
  }

  getSingleTarget(id) {
    this.empReportService.getSingleTarget(id).subscribe((res) => {
      try{
        this.form.patchValue(res[0])
      }
      catch{
        this.location.back()
      }

    }, (err) => {
      console.log(err.message)
    })
  }

  submit() {
    // trim white spaces for text fields
    this.Client.setValue(this.Client.value.trim())
    this.Task.setValue(this.Task.value.trim())
    this.Process.setValue(this.Process.value.trim())

    if (this.form.invalid) {
      this.showToastMessage("Please fill all fields", "warning")
      return;
    }
    this.empReportService.addTarget(this.form.value).subscribe((res)=>{
      if(res.response=="Success"){
        this.showToastMessage("New target added","success")
        this.form.reset()
        this.username.setValue(sessionStorage.getItem("user"))
      }
      else{
        this.showToastMessage("Target already exists","warning")
      }
    },(err)=>{
      console.log(err.message)
    })


  }

  edit() {

    if (this.form.invalid) {
      this.showToastMessage("Please fill all fields", "warning")
      return;
    }

    this.empReportService.updateTarget(this.form.value, this.id.value).subscribe((res) => {
      if (res.response == "Success") {
        this.showToastMessage("Success", "success")
        setTimeout(() => {
          this.location.back()
        }, 1000);
      }

    }, (err) => {
      console.log(err.message)
    })
  }
  deleteTarget() {


    this.empReportService.deleteTarget(this.dataToBeDeleted).subscribe((res) => {

      this.closeModal()
      if (res.response == "Success") {
        this.showToastMessage("Deleted successfully", "success")

        setTimeout(() => {

          this.location.back()
        }, 1000);
      }
      else {
        this.showToastMessage(res.response, "error")
      }
    }, (err) => {
      console.log(err.message)
    })
  }

  goBack() {
    this.location.back()
  }
  showModal() {
    // data.username = sessionStorage.getItem('user')
    console.log("modal function")
    this.modalBoolean = true;
    this.dataToBeDeleted = this.id.value;
  }
  closeModal() {
    this.modalBoolean = false;
    this.dataToBeDeleted = null;

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

  getDropDown() {
    this.empReportService.getDropDownList().subscribe((res) => {
      this.dropDownList = res;
      this.stateList = this.dropDownList.States;
      this.countyList = this.dropDownList.County;
    }, (err) => {
      console.log(err.message)
    })
  }

}
