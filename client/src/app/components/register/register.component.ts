import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms';
import { ConfirmValidator } from 'src/app/validators/confirm.validator';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ShopService } from 'src/app/services/shop.service';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public form:FormGroup
  public useridcheck:any=[]
  public emailcheck:any=[]
  public errors:any
  public idError=false
  public idvalue
  public emailError=false
  public emailvalue
  private cities:any=[]
  submitted = false;
  idnumberAlreadyExists=""
  emailAlreadyExists=""
  username:string
  numberOfProducts:any=""
  // productQ:string
  token:string
  productQ
  cart_id:any
  creation_date
  totalPrice
  ordersQ
  lastOrderDate
  ordersQTotal
  isAdmin
  registerErr:boolean=false

  constructor(public _us:UsersService,public _router:Router,public _fb:FormBuilder,public _sds:SharedDataService,
    public _ss:ShopService,public _os:OrderService) { }

  ngOnInit() {
    this._sds.currentIsAdmin.subscribe(isAdmin=>this.isAdmin=isAdmin)
    this.creation_date=sessionStorage.creation_date
    this.cart_id=sessionStorage.cart
    
    this._sds.currentOrdersQ.subscribe(ordersQ=>this.ordersQ=ordersQ)
  
    this._sds.currenttotalPrice.subscribe(totalPrice=>this.totalPrice=totalPrice)
    this._sds.currentpQ.subscribe(pQ =>this.productQ = pQ)
 
    this. _sds.currentUsername.subscribe(username => this.username = username)
    this. _sds.currentToken.subscribe(token => this.token= token)

  
  
    this.cities=['Jerusalem','Tel-aviv','Haifa','Ashdod','Rishon LeZiyyon',
    'PetahTikva','Beersheba','Netanya','Holon','Bnei Brak','Rehovot','Bat Yam']
    


   
    this.form = this._fb.group({
      email:["",[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      idnumber:[null,[Validators.required,Validators.pattern("[0-9]*")]],
      password:["",[Validators.required,Validators.minLength(8),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
      confirmPassword:["",[Validators.required]],
      city:[{value:"",disabled:true},Validators.required],
      street:[{value:"",disabled:true},Validators.required],
      fname:[{value:"",disabled:true},Validators.required],
      lname:[{value:"",disabled:true},Validators.required],
    },
    {
      validator: ConfirmValidator('password', 'confirmPassword')
    },
    )
  }
  stripText(control: FormControl) {
    control.setValue(control.value.replace(/[^0-9]/g, ''));
   }
   public idCheckUnique() {
    
    if(this.form.controls.idnumber.value){
       this.idvalue = this.form.controls.idnumber.value
      
    }
    else{
      this.idvalue=null
    }
    
    this._us.getids(this.idvalue).subscribe(res => {
      this.useridcheck = res;
      
     
      if (this.useridcheck.length > 0) {
        this.idnumberAlreadyExists = "idnumber Already Exists";
        this.idError=true 
      
      }
      else{
        this.idnumberAlreadyExists = "";
        this.idError=false 
      
      }
    });
    }
   public emailCheckUnique() {
    if(this.form.controls.email.value){
      this.emailvalue = this.form.controls.email.value
   }
   else{ 
     this.emailvalue=null
   }
    this._us.getemails(this.emailvalue).subscribe(res => {
      this.emailcheck = res;
     
      if (this.emailcheck.length > 0) {
        this.emailAlreadyExists = "Email Already Exists";
        this.emailError=true 
        
      }
      else{
        this.emailAlreadyExists = "";
        this.emailError=false 
     
      }
    });
    }
  public continue(){
    if(!this.form.controls.idnumber.errors && !this.form.controls.email.errors
       && !this.form.controls.password.errors && !this.form.controls.confirmPassword.errors && !this.idError && !this.emailError){
        this.form.get('city').enable();
        this.form.get('street').enable();
        this.form.get('fname').enable();
        this.form.get('lname').enable();
        this.errors=this.form.controls.idnumber.errors,
        this.form.controls.email.errors,this.form.controls.password.errors,this.form.controls.confirmPassword.errors
       }
    if(this.form.controls.idnumber.errors || this.form.controls.email.errors
      || this.form.controls.password.errors || this.form.controls.confirmPassword.errors || this.idError || this.emailError ){
        this.errors=this.form.controls.idnumber.errors ||
        this.form.controls.email.errors || this.form.controls.password.errors || this.form.controls.confirmPassword.errors ||
        this.idError || this.emailError
    
      
        }
       
  }
  public changeCity(e) {
    this.form.get('city').setValue(e.target.value, {
       onlySelf: true
    }) 
  }
  public handleError = (controlName: string, errorName: string) => {
      return this.form.controls[controlName].hasError(errorName);
    }
  
  public choose(){
    this.submitted=true
  }
  closeErr(){
    this.registerErr=false
  }
public register(){
   this.submitted=true
   return this._us.register(this.form.value).subscribe(
     res=>{
     sessionStorage.token=res['token'],
     this. _sds.getToken(sessionStorage.token),

       
     sessionStorage.isAdmin=res['isAdmin']
     this._sds.isAdmin(sessionStorage.isAdmin)

       sessionStorage.u = res['userFname'],
       this._sds.showUsername(sessionStorage.u)
       
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
            this.creation_date=sessionStorage.creation_date
           
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
            )
     this._router.navigateByUrl("/")
        this.registerErr=false;   
    },
    err=>{console.log(err),
      this.registerErr=true
    } 
   )
  }

}
