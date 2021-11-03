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
  private url: string = "http://localhost:5000/api/login"
  private roleNavigationObject = {
    "Production Reports": ["MonthlyReportComponent", "EmployeeReportComponent", "YearlyEmployeeReportComponent"],
    "Client Reports": ["ClientReportComponent", "YearlyClientReportComponent", "HomeComponent", "FileReportComponent"],
    "Admin": ["AddEmployeeComponent", "ViewEmployeeComponent"],
    "Add Role": ["AddRoleComponent"],
    "Order Entry": ["EmployeesendreportComponent"],
    "My Production Data": ["OrderListComponent"]
  }



  login(data: any): Observable<any> {
    return this.http.post<any>(this.url, data)
  }

  saveUsername(user, description, account_name) {
    sessionStorage.setItem('user', user)
    sessionStorage.setItem('role', description)
    sessionStorage.setItem('account_name', account_name)




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

    // session storage
    let nav = sessionStorage.getItem("role").split(",")
    let validComponents=[]
    console.log(nav)
    nav.forEach((description) => {
      validComponents = [...validComponents, ...this.roleNavigationObject[description]]
    })
    if(!validComponents.includes(componentName)){
      this.router.navigate(['home'])
    }

  }


}