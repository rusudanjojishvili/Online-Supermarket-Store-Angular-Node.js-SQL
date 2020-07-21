import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  username:string
  token:string
  productQ
  cartId:any
  creation_date
  totalPrice
  ordersQ
  isAdmin
  showNavBar:boolean=false
  ha:boolean=false


  constructor(public _router:Router,public _sds:SharedDataService) { }
  
  ngOnInit() {
    this._sds.currentIsAdmin.subscribe(isAdmin=>this.isAdmin=isAdmin)
    this._sds.currentpQ.subscribe(pQ =>this.productQ = pQ)
    this._sds.currentOrdersQ.subscribe(ordersQ=>this.ordersQ=ordersQ)
    this. _sds.currentUsername.subscribe(username => this.username = username)
    this. _sds.currentToken.subscribe(token => this.token= token)
    this. _sds.currentcartId.subscribe(cartId => this.cartId= this.cartId)
    
 
  }


 
gohome(){
  this._router.navigateByUrl("/")
}
 public logout(){
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("u")
    sessionStorage.removeItem("pN")
    sessionStorage.removeItem("cart")

    sessionStorage.removeItem("creation_date")
    this._sds.getCreationDate(sessionStorage.creation_date)

    sessionStorage.removeItem('totalPrice')

    sessionStorage.removeItem('ordersQ')
    this._sds.getordersQ(sessionStorage.ordersQ)

    sessionStorage.removeItem('isAdmin')
    this._sds.isAdmin(sessionStorage.isAdmin)

    this._sds.showUsername(sessionStorage.u) 
    this. _sds.getToken(sessionStorage.token)
    this._sds.getpQ(sessionStorage.pN)
    this._sds.getcartId(sessionStorage.cart) 
    this._router.navigateByUrl("/")
  
  }
} 