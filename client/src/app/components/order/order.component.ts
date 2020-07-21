import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ShopService } from 'src/app/services/shop.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {MatCalendarCellCssClasses} from '@angular/material/datepicker';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MatDialogConfig, MatDialog } from "@angular/material";
import { Pipe, PipeTransform} from '@angular/core'
import { DomSanitizer} from '@angular/platform-browser'
import { creditCardValidator } from 'src/app/validators/creditCard.Validator';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import * as moment from 'moment';
import { OrderService } from 'src/app/services/order.service';


@Pipe({
    name: 'highlight'
})
export class HighlightSearch implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}

  transform(value: any, args: any): any {
    if (!args) {
      return value;
    }
    // Match in a case insensitive maner
    //make it global,i.e highlight all the matches
    const re = new RegExp(args, 'gi');
    const match = value.match(re);

    // If there's no match, just return the original value
    if (!match) {
      return value;
    }

    const replacedValue = value.replace(re, "<mark>" + match[0] + "</mark>")
    return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
  }
}

 

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  private url:string="http://localhost:1000/public/uploads/"
  totalPrice
  prodQperCart
  ordersQ
  chosenProducts
  cart_id
  public form:FormGroup
  public searchForm:FormGroup
  userAddress
  city=""
  busyDates:any=[]
  dateCheck
  searchTerm: string;
  last4Digits =""
  fileUrl
  productName
  ProductQ
  productPrice
  isCartEmpty:boolean=false
 emptyCartError:boolean=false
 minDate
  
  constructor(public _router:Router,public _sds:SharedDataService,public _ss:ShopService,public _fb:FormBuilder,public _os:OrderService,
    public dialog:MatDialog) {}

  ngOnInit() {
    this.cart_id=sessionStorage.cart
    this._sds.currenttotalPrice.subscribe(totalPrice=>this.totalPrice=totalPrice)
    this._sds.currentpQ.subscribe(pQ=>this.prodQperCart=pQ)
    this._sds.currentOrdersQ.subscribe(ordersQ=>this.ordersQ=ordersQ)
  

    this.minDate = moment(new Date()).format('YYYY-MM-DD')  

    this._ss.getProductsByCart(this.cart_id).subscribe(
      res=>{
        this.chosenProducts= res
        if(this.chosenProducts.length==0){
          this.isCartEmpty=true
        }else{
          this.isCartEmpty=false
        }
      }, 
      err=>console.log(err)
    )
   
    this._os.getUserAddress(this.cart_id).subscribe(
      res=>{this.userAddress = res
      },
      err=>console.log(err)
    )
    this._os.getBusyDates().subscribe(
      res=>{this.busyDates = res
      },
      err=>{console.log(err)}
    )
  this.form = this._fb.group({
    cart_id:this.cart_id,
    total_price:this.totalPrice,
    delivery_city:["",Validators.required],
    delivery_street:["",Validators.required],
    delivery_date:["",Validators.required],
    credit_card:["",[Validators.required,creditCardValidator.cardsValidator]]

  }
  ) 
  this.searchForm = this._fb.group({
    name:["",Validators.required]
  })
  }

  updateSearch(e) {
    this.searchTerm = e.target.value
  }
  showCity(){ 
    this.form.get('delivery_city').setValue(this.userAddress.city, {
      onlySelf: true
   }) 
  }
  showStreet(){
    this.form.get('delivery_street').setValue(this.userAddress.street, {
      onlySelf: true
   })
  }
  submit(){
    console.log(this.form.value)
  }

  dateClass = (date: Date): MatCalendarCellCssClasses=> {
    const highlightDate = this.busyDates
    .map(strDate => new Date(strDate))
    .some(d => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());
    
  return highlightDate ? 'example-custom-date-class' : '';
  
     
  }
  public convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  
 
  checkEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    let value=`${event.value}`
    if(value!=="null"){
      let convertedValue = this.convert(value)
    this._os.checkDate(convertedValue).subscribe(
      res=>{
        this.dateCheck=res['ordersNByDay']
        let ordersPerDate = Number(this.dateCheck)
        // if(ordersPerDate>3){
        //   console.log('You have to choose another day, all shipments are busy')
        // }
      },
      err=>{console.log(err)} 
    )
  }
}
 
  stripText(control: FormControl) {
    control.setValue(control.value.replace(/[^0-9]/g, ''));
   }
  public order(){
   
    this._os.order(this.form.value).subscribe(
       res=>{
       
        this._os.ordersQPerCart(this.cart_id).subscribe(
                  res=>{
                    
                      sessionStorage.ordersQ = res,
                      this._sds.getordersQ(sessionStorage.ordersQ)
                      
                  
                },
                  err=>console.log(err)
                )
          sessionStorage.pN = 0
          this._sds.getpQ(sessionStorage.pN)
        
          sessionStorage.totalPrice=0
          this._sds.getTotalPrice(sessionStorage.totalPrice)
          
          const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true; 
            dialogConfig.width = "400px";
            dialogConfig.panelClass = 'my-class'
            
            this.productName= this.chosenProducts.map(p=>{
              return p.name
            })
           
            dialogConfig.data = {
              chosenProducts:this.chosenProducts
          };
          let dialogRef = this.dialog.open(DialogConfirmComponent, dialogConfig)
          
          dialogRef.afterClosed().subscribe(result=>{
           // here is the result of modal
          })
      },
       err=>{console.log(err)}
    )
  }
 
}
 