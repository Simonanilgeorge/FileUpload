import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  private url="http://localhost:5000/login"


  login(data:any):Observable<any> {
    return this.http.post<any>(this.url,data)
  }

saveUsername(user){

sessionStorage.setItem('user',user)
}

onLogOut(){

  sessionStorage.clear();
}


}
