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


  sendReport(data: any): Observable<any> {
    return this.http.post<any>(this.url, data)
  }

  getReport():Observable<any>{
    return this.http.get<any>(this.url);
  }

  getReportByFilter(date):Observable<any>
  {
    // console.log(`${this.url}/${date}`);
    console.log(typeof(date));
    console.log(this.url+'/'+"date");
    return this.http.post<any>(`${this.url}/date`,date)
  }
}
