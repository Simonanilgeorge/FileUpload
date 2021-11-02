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


  login(data: any): Observable<any> {
    return this.http.post<any>(this.url, data)
  }

  saveUsername(user, description, account_name) {
    sessionStorage.setItem('user', user)
    sessionStorage.setItem('role', description)
    sessionStorage.setItem('account_name', account_name)
    // for testing
    if (account_name == "CH20006") {
      sessionStorage.setItem('role', 'Admin')
    }
  }

  // use this function to get role of user
  // getRole(name):Observable<any>{
  //   return this.http.get<any>(this.url,name)
  // }

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
  // use this funciton to return nav array
  checkRole() {
    let role: string[] = [sessionStorage.getItem('role')];
    return role
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



    // let role: string = sessionStorage.getItem('role');
    // let managerRoles:string[] = ["TEAM LEADER", "SENIOR ASSOCIATE", "PROCESS ASSOCIATE","Admin","Manager"]
    // let employeeRoles:string = "";
    // let manager: boolean = false
    // let employee: boolean = false;


    // if (managerRoles.includes(role)) {
    //   employee = false;
    //   manager = true;
    // }
    // else {
    //   employee = true;
    //   manager = false;
    // }


    // return [employee, manager];

  }

  navigateByRole(componentName) {



    // let managerAccess:string[]= ["HomeComponent", "EmployeeReportComponent", "FileReportComponent","MonthlyReportComponent","ClientReportComponent","AddEmployeeComponent","ViewEmployeeComponent","YearlyClientReportComponent","YearlyEmployeeReportComponent"];
    // let employeeAccess:string[] = ["EmployeesendreportComponent","OrderListComponent"];
    // let managerRoles:string[] = ["TEAM LEADER", "SENIOR ASSOCIATE","Admin","Manager"]
    // let employeeRoles:string[] = ["","PROCESS ASSOCIATE","Employee"];
    // let role: string = sessionStorage.getItem('role');
    // if (managerRoles.includes(role) && employeeAccess.includes(componentName)) {
    //   this.router.navigate(['home'])
    // }

    // else if (employeeRoles.includes(role) && managerAccess.includes(componentName)) {
    //   this.router.navigate(['home']);

    // }

    // else if (!employeeRoles.includes(role) && !managerRoles.includes(role) && managerAccess.includes(componentName)){
    //   this.router.navigate(['home'])
    // }

  }


}