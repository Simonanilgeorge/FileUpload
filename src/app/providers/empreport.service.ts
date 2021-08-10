import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmpreportService {

  constructor(private http: HttpClient, private router: Router) { }
  private url = "http://localhost:4200/api/empreport";
  private statusUrl = "http://localhost:4200/api/mystatus"
  private dropDownUrl = "http://localhost:4200/api/dropdown"
  private monthlyReportUrl = "http://localhost:4200/api/revenue"
  private clientReportUrl = "http://localhost:4200/api/clientrprt"
  private singleReportUrl="http://localhost:4200/api/singlestatus"
  private employeeUrl="http://localhost:4200/api/addemployee"
  private editEmployeeUrl="http://localhost:4200/api/editemployee"
  private yearlyClientUrl="http://localhost:4200/api/yearlyclientrprt"

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
    let data={
      inputs:null
    };
    data.inputs=deleteObject


    return this.http.post<any>(`${this.editEmployeeUrl}/${deleteObject.empcode}`,data)
  }

getYearlyClientReport(data):Observable<any>{
  return this.http.post<any>(this.yearlyClientUrl,data)
}

}