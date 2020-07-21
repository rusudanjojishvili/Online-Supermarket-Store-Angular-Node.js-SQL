import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import {observable, Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(public http:HttpClient) { }

//shopping routes
  public getCategories(){
    return this.http.get("http://localhost:1000/shop/categories",{
     responseType:"json"
   })
  }
  public getProductsByCateg(id){
    return this.http.get("http://localhost:1000/shop/products/"+id,{
      headers:{'token':sessionStorage.token},
     responseType:"json"
   })
  }
  public getProductsQ(){
    return this.http.get("http://localhost:1000/shop/productsQ")
  }
  public searchProduct(body){
    return this.http.post("http://localhost:1000/shop/products/search",body,{
      headers:{'content-type':'application/json'},
      responseType:"json"
    })
  }
  public addToCart(id,body){
    return this.http.post("http://localhost:1000/shop/addToCart/"+id,body,{
      headers:{'Content-Type':'application/json','token':sessionStorage.token},
      responseType:"text"
    })
  }
  public getProductsNPerCart(id){
    return this.http.get("http://localhost:1000/shop/prodQperCart/"+id,{
      headers:{'token':sessionStorage.token},
      responseType:"json"
  })
  }
  public getProductsByCart(id){
    return this.http.get("http://localhost:1000/shop/productsByCart/"+id,{
      headers:{'token':sessionStorage.token},
      responseType:"json"
  })
  }
  // public getProductsDownload(id){
  //   return this.http.get("http://localhost:1000/shop/productsByCart/"+id,{
  //     responseType:"blob",headers: {'Accept': 'application/pdf'}
  // })
  // }
 
  public getCartOpeningDate(id){
    return this.http.get("http://localhost:1000/shop/cartOpeningDate/"+id,{
      headers:{'token':sessionStorage.token},
      responseType:"json"
  })
  }
  public getTotalPrice(id){
    return this.http.get("http://localhost:1000/shop/totalPrice/"+id,{
      headers:{'token':sessionStorage.token},
      responseType:"json"
  })
  } 

  public increaseQ(id,proId){
    return this.http.put("http://localhost:1000/shop/increaseQ/"+ id + "/"+ proId,{},
    {headers:{'Content-Type':'application/json','token':sessionStorage.token},
      responseType:"text"})
  }

  public decreaseQ(id,proId){
    return this.http.put("http://localhost:1000/shop/decreaseQ/"+ id+"/"+proId,{},
    {headers:{'Content-Type':'application/json','token':sessionStorage.token},
      responseType:"text"
    })
  }
  public deleteFromCart(id){
    return this.http.delete("http://localhost:1000/shop/deleteFromCart/"+id,{
      headers:{'token':sessionStorage.token},
      responseType:"text"
    })
  }
  public deleteCart(id){
    return this.http.delete("http://localhost:1000/shop/deleteCart/"+id,{
      headers:{'token':sessionStorage.token},
      responseType:"text"
  })
  }
}
