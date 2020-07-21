import { Component, OnInit} from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { DialogModalComponent } from '../dialog-modal/dialog-modal.component';
import { SharedDataService } from 'src/app/services/shared-data.service';
import {TooltipPosition} from '@angular/material/tooltip';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {

 public categories:any=[]
 public products:any=[]
 private url:string="http://localhost:1000/public/uploads/"
 opened:boolean=true
 private id=1
 isActive:Boolean=false
 public form:FormGroup
 name: string;
 prodQperCart:any
 cart_id
 chosenProducts:any=[]
 totalPrice
 pricenull=0
 creation_date
 isCartEmpty:boolean=false
 emptyCartError:boolean=false

  constructor(public _ss:ShopService,public _fb:FormBuilder,public dialog:MatDialog,private _sds:SharedDataService,public _router:Router) { 
    
  }
  showFiller = true;
  ngOnInit() {
    if(sessionStorage.isAdmin==0){
    
     
    this.cart_id = sessionStorage.cart
    this.getProductsByCart()
    this._sds.currentCreationDate.subscribe(creation_date=>this.creation_date=creation_date)
    this._sds.currenttotalPrice.subscribe(totalPrice=>this.totalPrice=totalPrice)
    this. getPNumberperCart()
    this.form = this._fb.group({
      name:["",Validators.required]
    })
      this._ss.getCategories().subscribe(
      res=>{this.categories=res,
        this.categories[0].isClicked=true},
      err=>console.log(err)
    )
      this._ss.getProductsByCateg(this.id).subscribe(
      res=>{this.products=res}, 
      err=>console.log(err)
    )
    
   
      }
  }
  getProductsByCart(){
    this._ss.getProductsByCart(this.cart_id).subscribe(
     res=>{this.chosenProducts= res
   
       if(this.chosenProducts.length==0){
        this.isCartEmpty=true
      }else{
        this.isCartEmpty=false
      }
       this. getTotalPrice()
     }, 
     err=>console.log(err)
   )
 }

  getPNumberperCart(){
    this._ss.getProductsNPerCart(this.cart_id).subscribe(
      res=>{this.prodQperCart= res,
        sessionStorage.pN=res,
        this._sds.getpQ(sessionStorage.pN)
      },
      err=>console.log(err)
    )
  }
  updateCartOpenDate(){
    this._ss.getCartOpeningDate(this.cart_id).subscribe(
      res=>{
      sessionStorage.creation_date=res['cartOpening_date'],
      this._sds.getCreationDate(sessionStorage.creation_date)
      },
      err=>console.log(err)
     )
  }

  increaseQ(id){
    this._ss.increaseQ(this.cart_id,id).subscribe(
    res=>{
     
      this.getProductsByCart(),
      this.getPNumberperCart(),
      this.getTotalPrice()
    },
    err=>console.log(err)
  )
}
  decreaseQ(id){
   
    this._ss.decreaseQ(this.cart_id,id).subscribe(
    res=>{
      
      this.getProductsByCart(),
      this.getPNumberperCart(),
      this.getTotalPrice()
    },
    err=>console.log(err)
  )
}

  deleteFromCart(id){
    this._ss.deleteFromCart(id).subscribe(
      res=>{this.getProductsByCart(),
      this.getPNumberperCart(),
      this.getTotalPrice()},
      err=>console.log(err)
    )
  }  
   getTotalPrice() {
    let total = 0;
    for(let p of this.chosenProducts){
      total += p.priceByQuantity
    }
    
   this.totalPrice = total
   sessionStorage.totalPrice=total,
      this._sds.getTotalPrice(sessionStorage.totalPrice)

  }
  public getProducts(e,categ){
    
    for (let c of this.categories) {
      c.isClicked = false;
    }
  
    categ.isClicked = true;
    this._ss.getProductsByCateg(e).subscribe(
      res=>{this.products=res},
      err=>console.log(err)
    )}
    public searchProduct(){
    
      this._ss.searchProduct(this.form.value).subscribe(
        res=>{this.products=res},
        err=>console.log(err)
      )}
    
    openDialog(product:any){
     
      const dialogConfig = new MatDialogConfig();

        dialogConfig.width = "230px";
        
        
        dialogConfig.data = {
          //here we pass info about the chosen product
          p_id:product.id,
          p_name:product.name,
          img:product.img_url,
          price:product.price,
         
      };
      let dialogRef = this.dialog.open(DialogModalComponent, dialogConfig)
      
      dialogRef.afterClosed().subscribe(result=>{

        if(result!==undefined){
        this._ss.addToCart(this.cart_id,result).subscribe(
          res=>{
          this.getProductsByCart()
          
          this.getPNumberperCart()

          this.updateCartOpenDate()
          
          },
          err=>console.log(err) 
        )
       
     
        }
      })
    }
    
    public deleteCart(){
      this._ss.deleteCart(this.cart_id).subscribe(
          res=>{
            this.getProductsByCart()
            this.getPNumberperCart()
          },
          err=>console.log(err) 
      )
    }
    public switchToOrder(){
      if(this.isCartEmpty){
        this.emptyCartError= true
      }else{
      this._router.navigateByUrl("/order")
      }
    }
    
    


}
 