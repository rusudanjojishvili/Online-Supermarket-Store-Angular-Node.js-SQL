import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
// public isLoggedIn
  constructor(public http:HttpClient) { }

  
 public getids(id){
   return this.http.get("http://localhost:1000/users/ids/"+id,{
    responseType:"json"
  })
 }
 public getemails(email){
   return this.http.get("http://localhost:1000/users/emails/"+email,{
    responseType:"json"
  })
 }
 
  public login(body: any){
    return this.http.post("http://localhost:1000/users/login",body,{
      headers:{'content-type':'application/json'},
      responseType:"json"
    })
  }

  public register(body: any){
    return this.http.post("http://localhost:1000/users/register",body,{
      headers:{'content-type':'application/json'},
      responseType:"json"
    })
  }
 
}
  