import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeReportComponent } from '../components/employee-report/employee-report.component';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }
  private url = "http://localhost:5000/login"

  private managerAccess = ["HomeComponent", "EmployeeReportComponent", "FileReportComponent"];
  private employeeAccess = ["EmployeesendreportComponent"];
  private managerRoles = ["TEAM LEADER", "SENIOR ASSOCIATE", "PROCESS ASSOCIATE","team lead"]
  private employeeRoles = [""];
  private role: string = sessionStorage.getItem('role');
  login(data: any): Observable<any> {
    return this.http.post<any>(this.url, data)
  }

  saveUsername(user, description, account_name, cn) {

    sessionStorage.setItem('user', user)
    sessionStorage.setItem('role', description)
    sessionStorage.setItem('account_name', account_name)
    sessionStorage.setItem('cn', cn)
  }

  onLogOut() {

    sessionStorage.clear();
  }



  checkSessionStorage() {
    let user;
    user = sessionStorage.getItem('user');

    if (user) {
      
      return user;

    }
    else {
      this.router.navigate(['']);

    }
  }

  checkRole() {
    let manager: boolean = false
    let employee: boolean = false;
    

    if (this.role == "") {
      employee = true;
      manager = false;
    }
    else {
      employee = false;
      manager = true;
    }
    return [employee, manager];

  }

  navigateByRole(componentName) {


    if (this.employeeRoles.includes(this.role) && this.managerAccess.includes(componentName)) {
      this.router.navigate(['home']);

    }
    if (this.managerRoles.includes(this.role) && this.employeeAccess.includes(componentName)) {
      this.router.navigate(['home'])
    }

  }


}

