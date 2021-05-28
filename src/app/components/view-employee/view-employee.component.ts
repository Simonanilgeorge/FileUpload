import { Component, OnInit} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { EmpreportService } from '../../providers/empreport.service';
import { LoginService } from '../../providers/login.service'


@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {

  modalBoolean: Boolean = false
  titles = [];
dataToBeDeleted;
  titleName;
  message = null;
  toast: Boolean = false;
  searchedKeyword;
  data = [];
  flag: Boolean = false;
  constructor(private empReportService: EmpreportService, private router: Router, private loginService: LoginService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loginService.checkSessionStorage();
    this.loginService.navigateByRole(this.constructor.name)

    this.getEmployees();

  }


  getEmployees() {


    this.empReportService.getEmployees().subscribe((res) => {

      res = JSON.parse(res);
      this.data = res;
      this.titles = this.data.map((data) => {
        return Object.keys(data);
      })[0];
      this.titles.pop()
      this.flag = true
    }, (err) => {
      console.log(err.message);
    })


  }

  edit(data) {

    sessionStorage.setItem("employeeID", data.id);
    this.router.navigate(['/addemployee'])

  }
  delete(data) {

this.modalBoolean=false;
    this.empReportService.deleteEmployee(data).subscribe((res) => {
      
      this.showToastMessage("Deleted successfully")
      
      this.ngOnInit();
    }, (err) => {
      this.showToastMessage("Deletion failed")
      console.log(err.message)
    })

  }
  showToastMessage(message) {
    this.message = message;
    this.toast = true;
    setTimeout(() => {
      this.toast = false;
    }, 2000)
  }

  getTitleName(title) {

    this.titleName = null;
    setTimeout(() => {
      this.titleName = title;
    }, 100)


  }
  showModal(data) {
    // (click)="delete(data)" 
    console.log(data)


    this.modalBoolean = true;
    this.dataToBeDeleted=data;
  }

  closeModal() {

    this.modalBoolean = false;
    this.dataToBeDeleted=null;
  }

}