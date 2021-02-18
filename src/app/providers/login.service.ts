import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }
  private url="http://127.0.0.1:5000/login";
  private user=null;

  login(data:any):Observable<any> {
    return this.http.post<any>(this.url,data)
  }

saveUsername(user){
this.user=user;
}

onLogOut(){
  this.user=null;
}

getUsername(){
  return this.user;
}

}
