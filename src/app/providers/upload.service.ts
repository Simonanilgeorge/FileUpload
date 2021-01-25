import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }
  private url="sample/upload";
  
  uploadFile(formData:any):Observable<any> {
    return this.http.post<any>(this.url,formData)

  }


}
