import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }
  private url="http://127.0.0.1:5000/getfile";
  
  uploadFile(formData:any):Observable<any> {
    return this.http.post<any>(this.url,formData)

  }



}
