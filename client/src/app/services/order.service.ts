import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(public http:HttpClient) { }
  
  //order Routes
  public getOrdersInTotal(){
    return this.http.get("http://localhost:1000/order/ordersQTotal")
  }
  public getLastOrderDate(id){
    return this.http.get("http://localhost:1000/order/lastOrderDate/"+id,{
      headers:{'token':sessionStorage.token},
      responseType:"json"
    })
  }

  public ordersQPerCart(id){
    return this.http.get("http://localhost:1000/order/ordersQperCart/"+id,{
      headers:{'token':sessionStorage.token},
      responseType:"text"
  })
  }
 
  public getUserAddress(id){
    return this.http.get("http://localhost:1000/order/showUserAddress/"+id,{
      headers:{'token':sessionStorage.token},
      responseType:"json"
    })
  }
  public getBusyDates(){
    return this.http.get("http://localhost:1000/order/showBusyDates",{
      headers:{'token':sessionStorage.token}
    })
  }
  public checkDate(id){
    return this.http.get("http://localhost:1000/order/checkDate/"+id,{
      headers:{'token':sessionStorage.token}
    })
  }
  public order(body){
    return this.http.post("http://localhost:1000/order/makeOrder/",body,{
      headers:{'Content-Type':'application/json','token':sessionStorage.token},
      responseType:"text"
    })
  }

 
  public download(body){
    return this.http.post("http://localhost:1000/download",body,{
      responseType:"blob",
      headers: {'Accept': 'application/txt','token':sessionStorage.token}
    })
  }
}
