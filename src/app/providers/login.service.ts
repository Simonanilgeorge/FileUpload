import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }
  private url = "http://localhost:5000/login"


  login(data: any): Observable<any> {
    return this.http.post<any>(this.url, data)
  }

  saveUsername(user,description,account_name) {

    sessionStorage.setItem('user', user)
    sessionStorage.setItem('role',description)
    sessionStorage.setItem('account_name',account_name)
  }

  onLogOut() {

    sessionStorage.clear();
  }



  checkSessionStorage() {
    let user;
    user = sessionStorage.getItem('user');

    if (user) {
      console.log(`The user currently logged in is ${user}`)
      return user;

    }
    else {
      this.router.navigate(['']);

    }
  }

}
