import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeReportComponent } from '../components/employee-report/employee-report.component';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  encryptSecretKey = "test"

  constructor(private http: HttpClient, private router: Router) { }
  private url: string = `${environment.url}/api/login`
  private roleNavigationObject = {
    "Production Reports": ["MonthlyReportComponent", "EmployeeReportComponent", "YearlyEmployeeReportComponent"],
    "Client Reports": ["ClientReportComponent", "YearlyClientReportComponent", "HomeComponent", "FileReportComponent"],
    "Admin": ["AddEmployeeComponent", "ViewEmployeeComponent"],
    // "Add Role": ["AddRoleComponent"],
    "Super Admin": ["AddEmployeeComponent", "ViewEmployeeComponent", "ClientReportComponent", "YearlyClientReportComponent", "HomeComponent", "FileReportComponent", "AddRoleComponent", "TargetTableComponent", "AddTargetComponent", "IncentiveReportComponent", "MonthlyReportComponent", "EmployeeReportComponent", "YearlyEmployeeReportComponent"],
    "Order Entry": ["EmployeesendreportComponent"],
    "My Production Data": ["OrderListComponent"]
  }


  login(data: any): Observable<any> {
    return this.http.post<any>(this.url, data)
  }

  saveUsername(user, description, account_name, token) {

    sessionStorage.setItem('user', user)
    let encrypt = CryptoJS.AES.encrypt(description.join(","), token).toString();
    sessionStorage.setItem('role', encrypt)
    sessionStorage.setItem('account_name', account_name)
    sessionStorage.setItem('token', token)
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


  navigateByRole(componentName) {


    let decrypt= CryptoJS.AES.decrypt(sessionStorage.getItem("role"),sessionStorage.getItem("token")).toString(CryptoJS.enc.Utf8)
    let nav = decrypt.split(",")
    let validComponents = []
    nav.forEach((description) => {
      validComponents = [...validComponents, ...this.roleNavigationObject[description]]
    })

    if (!validComponents.includes(componentName)) {
      this.router.navigate(['home'])
    }

  }


}