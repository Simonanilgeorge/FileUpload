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
  
  uploadFile(formData:any):Observable<any> {
    return this.http.post<any>(this.url,formData)

  }

  
  getFilteredData(data:any):Observable<any> {
    return this.http.post<any>(this.filterUrl,data)

  }


  getData(date):Observable<any>{
    
    console.log("date");
    if(date.length==0){
      date="none";
    } 
    return this.http.get<any>(`${this.url}/${date}`);

  }
}
