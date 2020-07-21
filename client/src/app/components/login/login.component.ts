import { Component, OnInit,Input, Output,EventEmitter,OnChanges, SimpleChange, SimpleChanges  } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ShopService } from 'src/app/services/shop.service';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form:FormGroup
  token:string
  username:string
  numberOfProducts:any=""
  productQ
  ordersQ
  cart_id:any
  creation_date
  totalPrice
  lastOrderDate
  ordersQTotal
  isAdmin
  signInErr:boolean=false

  

  constructor(public _us:UsersService,public _fb:FormBuilder,public _router:Router,private _sds:SharedDataService,
    public _ss:ShopService,public _os:OrderService) { }




  ngOnInit() {

    this._sds.currentCreationDate.subscribe(creation_date=>this.creation_date=creation_date)
    this._sds.currentIsAdmin.subscribe(isAdmin=>this.isAdmin=isAdmin)
    this.creation_date=sessionStorage.creation_date
    this.cart_id=sessionStorage.cart
   
    this._sds.currentOrdersQ.subscribe(ordersQ=>this.ordersQ=ordersQ)
    
    this._sds.currenttotalPrice.subscribe(totalPrice=>this.totalPrice=totalPrice)
    this._sds.currentpQ.subscribe(pQ =>this.productQ = pQ)
   
    this. _sds.currentUsername.subscribe(username => this.username = username)
    this. _sds.currentToken.subscribe(token => this.token= token)
    
    this.form = this._fb.group({
      email:["",Validators.required],
      password:["",Validators.required]
    })

     this._ss.getProductsQ().subscribe(
      res=>{this.numberOfProducts=res['NumberOfProducts']
      },
      err=>console.log(err)
    )
  
  this._os.getOrdersInTotal().subscribe(
    res=>{
       this.ordersQTotal=res['numberOfOrders']
    },
    err=>console.log(err)
  )
    if(this.cart_id!==undefined && this.isAdmin==0){
      this._os.getLastOrderDate(this.cart_id).subscribe(
      res=>{this.lastOrderDate=res['lastOrder']
        
      },
      err=>console.log(err)
    )
   }
  }
 
  closeErr(){
    this.signInErr=false
  }
  public login(){
    this._us.login(this.form.value).subscribe(
      res=>{ 
        sessionStorage.token=res['token'],
        this. _sds.getToken(sessionStorage.token),
        
        sessionStorage.isAdmin=res['isAdmin']
        this._sds.isAdmin(sessionStorage.isAdmin)

        sessionStorage.u = res['userFname'],
        this._sds.showUsername(sessionStorage.u)

        
        
        

        if(!res['isAdmin']){
        sessionStorage.cart = res['cart_id']
        
        sessionStorage.ordersQ = res['ordersQPerCart']
        this._sds.getordersQ(sessionStorage.ordersQ)

          this._ss.getProductsNPerCart(res['cart_id']).subscribe(
            res=>{
              sessionStorage.pN=res,
              this._sds.getpQ(sessionStorage.pN)
            },
            err=>console.log(err)
          )
          
          this._ss.getCartOpeningDate(res['cart_id']).subscribe(
            res=>{
            sessionStorage.creation_date=res['cartOpening_date'],
            this._sds.getCreationDate(sessionStorage.creation_date)
            },
            err=>console.log(err)
           )
          this._ss.getTotalPrice(res['cart_id']).subscribe(
              res=>{
                if(res!=null){
                sessionStorage.totalPrice=res['totalPrice'],
                this._sds.getTotalPrice(sessionStorage.totalPrice)
               
              }else{
                sessionStorage.totalPrice=0,
                this._sds.getTotalPrice(sessionStorage.totalPrice)
             
              }},
              err=>console.log(err)
            )
          this._os.getLastOrderDate(res['cart_id']).subscribe(
              res=>{this.lastOrderDate=res['lastOrder']
              },
              err=>console.log(err)
            )}
        if(res['isAdmin']){
          this._router.navigateByUrl("/admin")
        }
        this.signInErr=false
      },err=>{console.log("error",err),
      this.signInErr=true
      }
    )  
  }
  public goToShopping(){
    this._router.navigateByUrl("/shop")
  }



}
