import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmpreportService {

  constructor(private http: HttpClient, private router: Router) { }
  private url = "http://localhost:5000/empreport";
  private statusUrl = "http://localhost:5000/mystatus"
  private dropDownUrl = "http://localhost:5000/dropdown"
  private monthlyReportUrl = "http://localhost:5000/revenue"
  private clientReportUrl = "http://localhost:5000/clientrprt"
  private singleReportUrl="http://localhost:5000/singlestatus"
  private employeeUrl="http://localhost:5000/addemployee"
  private editEmployeeUrl="http://localhost:5000/editemployee"
  private yearlyClientUrl="http://localhost:5000/yearlyclientrprt"

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
    console.log(data)

    return this.http.post<any>(`${this.editEmployeeUrl}/${deleteObject.empcode}`,data)
  }

getYearlyClientReport(data):Observable<any>{
  return this.http.post<any>(this.yearlyClientUrl,data)
}

}