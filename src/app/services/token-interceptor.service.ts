import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpInterceptor} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req,next){
    let tokenizedRequest=req.clone({
      setHeaders:{
        Authorization:`Bearer ${sessionStorage.getItem("token")}` 
      }
    })

    return next.handle(tokenizedRequest)
  }
}
