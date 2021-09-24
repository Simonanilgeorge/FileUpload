import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmpreportService {

  constructor(private http: HttpClient, private router: Router) { }
  private url = "http://183.82.112.31:22543/api/empreport";
  private statusUrl = "http://183.82.112.31:22543/api/mystatus"
  private dropDownUrl = "http://183.82.112.31:22543/api/dropdown"
  private monthlyReportUrl = "http://183.82.112.31:22543/api/revenue"
  private clientReportUrl = "http://183.82.112.31:22543/api/clientrprt"
  private singleReportUrl="http://183.82.112.31:22543/api/singlestatus"
  private employeeUrl="http://183.82.112.31:22543/api/addemployee"
  private editEmployeeUrl="http://183.82.112.31:22543/api/editemployee"
  private yearlyClientUrl="http://183.82.112.31:22543/api/yearlyclientrprt"
  private yearlyEmployeeReportUrl = "http://183.82.112.31:22543/api/yearlyemprprt"
  private deleteEmployeeStatus="http://183.82.112.31:22543/api/delemprprt"

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

}