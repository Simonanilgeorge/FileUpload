import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }
  private url="http://localhost:5000/getfile";
  
  private filterUrl="http://localhost:5000/filter"
  
  private filterPivotTableUrl="http://localhost:5000/pivottables"
  uploadFile(formData:any):Observable<any> {
    return this.http.post<any>(this.url,formData)

  }

  // for sla expiration filter
  getFilteredData(data:any):Observable<any> {
    return this.http.post<any>(this.filterUrl,data)

  }


  getData():Observable<any>{
    return this.http.get<any>(this.url);
  }

  getFilteredPivotTable(data):Observable<any>{
    return this.http.post<any>(this.filterPivotTableUrl,data);

  }
}
