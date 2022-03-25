import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpreportService {

  constructor(private http: HttpClient, private router: Router) { }
  private url = `${environment.url}/api/empreport`;
  private statusUrl = `${environment.url}/api/mystatus`
  private dropDownUrl = `${environment.url}/api/dropdown`
  private monthlyReportUrl = `${environment.url}/api/revenue`
  private clientReportUrl = `${environment.url}/api/clientrprt`
  private singleReportUrl=`${environment.url}/api/singlestatus`
  private employeeUrl=`${environment.url}/api/addemployee`
  private editEmployeeUrl=`${environment.url}/api/editemployee`
  private yearlyClientUrl=`${environment.url}/api/yearlyclientrprt`
  private yearlyEmployeeReportUrl = `${environment.url}/api/yearlyemprprt`
  private deleteEmployeeStatus=`${environment.url}/api/delemprprt`
  private editRoleUrl=`${environment.url}/api/editrole`
  private addRoleUrl=`${environment.url}/api/addrole`
  private resetUrl=`${environment.url}/api/resetpassword`
  private targetTableUrl=`${environment.url}/api/target`
   
  
  sendReport(data: any): Observable<any> {
    return this.http.post<any>(this.url, data)
  }

  getReport(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getReportByFilter(date): Observable<any> {
    return this.http.post<any>(`${this.url}/date`, date);
  }

  getMyStatus(user): Observable<any> {
    return this.http.post<any>(this.statusUrl, user);

  }

  getDropDownList(): Observable<any> {
    return this.http.get<any>(this.dropDownUrl);
  }

  getMonthlyReport(date): Observable<any> {
    return this.http.post<any>(this.monthlyReportUrl, date);

  }

  getClientReport(date): Observable<any> {
    return this.http.post<any>(this.clientReportUrl, date);
  }


  getSingleReport(id):Observable<any>{

    return this.http.post<any>(this.singleReportUrl,id);
  }

  addEmployee(data):Observable<any>{
    return this.http.post<any>(this.employeeUrl,data)
  }

  getEmployees():Observable<any>{
    return this.http.get<any>(this.employeeUrl);
  }
  
  getSingleEmployee(id):Observable<any>{
    return this.http.get<any>(`${this.editEmployeeUrl}/${id}`)
  }

  deleteEmployee(deleteObject):Observable<any>{
    // let data={
    //   inputs:null
    // };
    // data.inputs=deleteObject
    return this.http.post<any>(`${this.editEmployeeUrl}/${deleteObject.inputs.empcode}`,deleteObject)
  }

getYearlyClientReport(data):Observable<any>{
  return this.http.post<any>(this.yearlyClientUrl,data)
}


getYearlyEmployeeReport(date): Observable<any> {
  return this.http.post<any>(this.yearlyEmployeeReportUrl, date);

}

deleteEmployeeReport(data): Observable<any> {
  return this.http.post<any>(this.deleteEmployeeStatus, data);

}
// role 
addRole(data):Observable<any>{
  return this.http.post<any>(`${this.addRoleUrl}`,data)
}

getRoles():Observable<any>{
  return this.http.get<any>(`${this.addRoleUrl}`)
}

deleteRole(data):Observable<any>{
  return this.http.put<any>(`${this.addRoleUrl}`,data)
}

editRole(data):Observable<any>{
  return this.http.put<any>(`${this.editRoleUrl}/${data.inputs.id}`,data)
}


resetPassword(data):Observable<any>{
  return this.http.post<any>(this.resetUrl,data)
}

getTargetTable(client:string){
  return this.http.get<any>(`${this.targetTableUrl}/${client}`)
}
}