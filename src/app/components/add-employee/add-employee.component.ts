import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
import { DatePipe, Location } from '@angular/common';



@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
  providers: [DatePipe]
})

export class AddEmployeeComponent implements OnInit {

  @ViewChild('myDiv') myDiv: ElementRef;

  modalBoolean: Boolean = false
  dataToBeDeleted;
  delete = false;
  selectGeneralShift = false;
  roleList
  // nonWhitespaceRegExp: RegExp = new RegExp("\\S");
  valid: boolean = true;
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
  toastStatus;


  constructor(private fb: FormBuilder, private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute, private datePipe: DatePipe, private elem: ElementRef, private location: Location) { }

  ngOnInit(): void {

    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole("AddEmployeeComponent")
    this.getDropDown();

    this.userForm = this.fb.group({

      inputs: this.fb.group({
        doj: [{ value: '', disabled: false }, Validators.required],
        empcode: [{ value: '', disabled: false }, Validators.required],
        name: [{ value: '', disabled: false }, Validators.required],
        task: [{ value: '', disabled: false }, Validators.required],
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

  get keys() {
    return [this.task,this.search, this.client,this.delay_reason,this.production_status]

  }

  // check if operation is update or delete
  checkUpdate() {

    const deleteEmployee = sessionStorage.getItem("deleteEmployee")
    // doj empcode name training duration to be disabled on update
    const id = sessionStorage.getItem("employeeID")
    if (id) {
      this.update = true;
      this.empcode.disable()
      this.name.disable()
      this.doj.disable()
      // this.training_duration.disable()
      this.getSingleEmployee();
    }
    else if (deleteEmployee) {
      this.userForm.disable()
      this.employeeID.id = deleteEmployee;
      this.delete = true
      this.getSingleEmployee();

    }
    else {
      this.update = false;

    }
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
    if (this.userForm.status === "INVALID") {

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
        this.selectGeneralShift = true
        this.delay_review_duration.disable()
        this.planned_out_of_review_date.disable()
        this.ngOnInit();
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
      sessionStorage.removeItem("employeeID");
      sessionStorage.removeItem("deleteEmployee")
      res = JSON.parse(res);

      // this.Tasklist = this.dropDownList[res[0].client];
      this.inputs.patchValue(res[0]);

      // if shift is not applicable populate fields with not applicable
      if (this.shift.value == "Not Applicable") {
        this.selectGeneralShift = true
        // this.changeShiftOptions()
      }

    }, (err) => {
      console.log(err.message);
    })


  }
  // toggle dropdown on click
  display() {
    this.displayBoolean = !this.displayBoolean;
  }



  // function called when client value changed
  changeClientOptions(event) {

    this.isActive = true
    setTimeout(() => {
      this.isActive = false
    }, 5)
    this.task.setValue("")
    this.Tasklist = this.dropDownList[this.inputs.value.client];

    if (this.client.value == "Not Applicable") {
      this.task.setValue("Not Applicable")
  
    }
  }


  // function called on selecting shift
  changeShiftOptions() {
    if (this.shift.value == "Not Applicable") {
      this.inputs.patchValue({
        // doj: this.datePipe.transform("2000-01-01", "yyyy-MM-dd"),
        planned_out_of_review_date: this.datePipe.transform("2000-01-01", "yyyy-MM-dd"),
        actual_out_of_review_date: this.datePipe.transform("2000-01-01", "yyyy-MM-dd"),
        search: "Not Applicable",
        client: "Not Applicable",
        task:"Not Applicable",
        production_status: "Not Applicable",
        training_duration: "Not Applicable",
        delay_reason: "Not Applicable",
        delay_review_duration:"0 days"

      })
      // this.uncheckAll()
      // this.Tasklist = []

      this.selectGeneralShift = true
    }
    else {
      this.keys.forEach((key)=>{
        if(key.value=="Not Applicable"){
          key.setValue("")
        }
      })

      // this.delay_reason.patchValue("No issue")
      this.selectGeneralShift = false

      // this.task.getRawValue().forEach((task, index) => {
      //   if (task == "Not Applicable") {
      //     this.task.removeAt(index)
      //   }
      // })
    }



  }


  // get dropdown array
  getDropDown() {


    this.empReportService.getDropDownList().subscribe((res) => {
      this.dropDownList = res;
      this.roleList = res.role
      this.ClientList = this.dropDownList.Client;
      this.checkUpdate();
    }, (err) => {
      console.log(err.message)
    })

  }


  getName(data) {

    this.training_duration.setValue(data);
  }

  counter(number: number) {

    let array = [];
    array.push(`${1} Week`)
    for (let i = 2; i <= number; i++) {

      array.push(`${i} Weeks`)
    }
    return array;
  }

  calculatePlannedDate() {

    if (this.training_duration.value != "" && this.doj.value != "" && this.training_duration.value != "Not Applicable") {
      // calculate planned date

      let days = this.training_duration.value.split(" ")[0] * 7;
      let result = new Date(this.doj.value);
      result.setDate(result.getDate() + days);


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
      // number of days only
      // this.delay_review_duration.setValue(`${result} days`)
    }
    else {
      this.valid = false;
      this.showToastMessage("actual out of review date cannot be before planned out of review date", "warning")
      return
    }

  }


  // @HostListener('document:click', ['$event']) 
  clickOutside(e) {

    if (e.target.classList.contains("clickoutside") || e.target.classList.contains("checkbox") || e.target.classList.contains("dropdown") || e.target.classList.contains("dropdown-text") || e.target.classList.contains("parent") || e.target.classList.contains("p-clickoutside")) {

      return
    } else {

      this.displayBoolean = false

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

      this.ngOnInit();
    }, (err) => {
      this.showToastMessage("Deletion failed", "error")
      console.log(err.message)
    })

  }

  goBack() {
    this.location.back()
  }


}





