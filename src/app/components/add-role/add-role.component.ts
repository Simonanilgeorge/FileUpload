import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ElementRef } from '@angular/core';
import { Validators, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  // remove later
  delete

  modalBoolean = false;
  dataToBeDeleted = {
    inputs: null
  }
  editFlag = 0;
  message = null;
  toast: Boolean = false;
  toastStatus
  flag = true
  displayBoolean = false;
  titles = ["role", "resources"]
  data = []
  resourceList = ["production reports", "client reports", "admin", "add role", "order entry", "my production data"]
  roleForm: FormGroup = this.fb.group({
    inputs: this.fb.group({
      id: [{ value: " ", disabled: true }],
      role: [{ value: "", disabled: false }, Validators.required],
      resources: this.fb.array([], Validators.required),
      username: [sessionStorage.getItem('user')]
    })
  })

  constructor(private fb: FormBuilder, private elem: ElementRef, private empReportService: EmpreportService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.getAllRoles()
  }

  get inputs() {
    return this.roleForm.get("inputs")
  }
  get role() {
    return this.inputs.get("role")
  }
  get resource() {
    return this.inputs.get("resources") as FormArray
  }

  get id() {
    return this.inputs.get("id")
  }

  display() {

    this.displayBoolean = !this.displayBoolean;

  }

  // add resources to array
  add(e, i) {
    // if(this.update){
    //   return;
    // }
    this.displayBoolean = !this.displayBoolean;

    if (e.target.checked) {
      this.resource.push(this.fb.control(e.target.value))
    }
    else if (!e.target.checked && this.resource.getRawValue().includes(e.target.value)) {
      let index = this.resource.getRawValue().findIndex((check) => {
        return e.target.value === check;
      })
      this.resource.removeAt(index);
    }
  }

  getAllRoles() {

    this.empReportService.getRoles().subscribe((res) => {
      this.data = JSON.parse(res)
    }, (err) => {
      console.log(err.message)
    })
  }

  // add new role
  submit() {

    if (!this.roleForm.valid) {
      this.showToastMessage("Please fill all the fields", "warning")
      return
    }

    this.empReportService.addRole(this.roleForm.getRawValue()).subscribe((res) => {
      this.getAllRoles()
      this.showToastMessage("role added", "success")
      this.data.push(this.inputs.value)

      this.resetForm()
    }, (err) => {
      console.log(err.message)
    })




  }

  uncheckAll() {

    let checkbox = this.elem.nativeElement.querySelectorAll('.clickoutside')
    checkbox.forEach((check) => {
      if (check.checked) {
        check.checked = false;
      }
    })
  }

  resetForm() {
    this.roleForm.reset()
    this.resource.clear()
    this.roleForm.enable()
    this.uncheckAll()
  }

  clickOutside(e) {

    if (e.target.classList.contains("clickoutside") || e.target.classList.contains("checkbox") || e.target.classList.contains("dropdown") || e.target.classList.contains("dropdown-text") || e.target.classList.contains("parent") || e.target.classList.contains("p-clickoutside")) {
      return
    } else {

      this.displayBoolean = false

    }
  }

  showToastMessage(message, status) {
    this.message = message;
    this.toastStatus = `${status}`
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }


  // on clicking edit icon
  edit(data) {
    this.resetForm()


    this.editFlag = 1;
    this.role.setValue(data.role)
    this.id.setValue(data.id)

    this.role.disable();
    // console.log(this.roleForm.value)
    // console.log( data.resource.split(","));
    // get all checkboxes 
    let checkbox = this.elem.nativeElement.querySelectorAll('.clickoutside')
    checkbox.forEach((check) => {
      data.resources.forEach((resource) => {
        if (resource == check.value) {
          this.resource.push(this.fb.control(resource))
          check.checked = true
        }
      })
    })
    console.log(data)
  }


  // submit edited form
  editRole() {

    if (!this.roleForm.valid) {
      this.showToastMessage("Please fill all the fields", "warning")
      return
    }
    // this.data.push(this.roleForm.getRawValue().inputs)
    this.empReportService.editRole(this.roleForm.getRawValue()).subscribe((res) => {
      this.getAllRoles()
      this.showToastMessage("role updated", "success")
      this.editFlag = 0;

      this.resetForm()
    }, (err) => {
      console.log(err.message)
    })

  }

  showModal(data) {

    console.log("data", data.resources)
    this.modalBoolean = true;
    this.inputs.patchValue(data)
    console.log(this.roleForm.getRawValue())

    // store data to be deleted to a variable

  }

  closeModal() {

    this.modalBoolean = false;
    this.resetForm()
    // this.dataToBeDeleted = null;
  }


  // write request to delete role
  deleteRole() {

    console.log("delete role function")


    this.empReportService.deleteRole(this.roleForm.getRawValue()).subscribe((res) => {
      console.log(res)
      if (res.response == null) {
        this.showToastMessage("deleted successfully", "success")
      }
      else {
        this.showToastMessage(res.response, "warning")
      }
      this.resetForm()
      this.getAllRoles()
      this.modalBoolean = false;
    }, (err) => {
      console.log(err.message)
    })


    // let roleNavigationObject = {
    //   "production reports": ["MonthlyReportComponent","EmployeeReportComponent","YearlyEmployeeReportComponent"],
    //   "client reports":["ClientReportComponent","YearlyClientReportComponent","HomeComponent","FileReportComponent"],
    //   "admin":["AddEmployeeComponent","ViewEmployeeComponent"],
    //   "add role":["AddRoleComponent"],
    //   "order entry":["EmployeesendreportComponent"],
    //   "my production data":["OrderListComponent"]
    // }


    // let nav = ["production reports", "my production data", "order entry"]
    // let output = []
    // nav.forEach((nav) => {
    //     output = [...output, ...roleNavigationObject[nav]]

    // })
  }


  cancelEdit(){
    this.editFlag=0;
    this.resetForm()
  }


}
