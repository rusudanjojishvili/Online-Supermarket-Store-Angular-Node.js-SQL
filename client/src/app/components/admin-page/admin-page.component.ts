import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder,Validators,FormGroup, FormControl} from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import {HttpEventType} from '@angular/common/http';
import { SharedDataService } from 'src/app/services/shared-data.service';


class ImageSnippet{
  pending: boolean = false;
  status: string = 'init';

  constructor(public src:string="",public file:File){}
}
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})

export class AdminPageComponent implements OnInit {
  public categories:any=[]
  public products:any=[]
  private url:string="http://localhost:1000/public/uploads/"
  opened=true;
  private id=1
  chosenProductName:any
  public addForm:FormGroup
  public updateForm:FormGroup
  public searchForm
  showAddForm:boolean=false
  showUpdateForm:boolean=false
  chosenProductId
  selectedFile:ImageSnippet
  controller:boolean=true
  fileName
  progress
  notification:boolean=false
  notificAddProd:boolean=false
  uploadError:boolean=false
  productaddError:boolean=false
  notificUpdateProd:boolean=false
  productUpdateErr:boolean=false
  imageToPreview
  

 

  constructor(public _ss:ShopService,public _router:Router,public _fb:FormBuilder,public _as:AdminService,public _sds:SharedDataService) { }

  ngOnInit() {
 
   
    if(sessionStorage.isAdmin==1){
    this.addForm = this._fb.group({
      name:["",Validators.required],
      price:["",Validators.required], 
      img_url:[null,Validators.required],
      c_id:["",Validators.required]
    })
    this.updateForm = this._fb.group({
      name:["",Validators.required],
      price:["",Validators.required], 
      img_url:["",Validators.required],
      c_id:["",Validators.required]
    })
    this.searchForm = this._fb.group({
      name:["",Validators.required]
    })
    this._ss.getCategories().subscribe(
      res=>{this.categories=res},
      err=>console.log(err)
    )
   this.getProductsByCateg()
      }
  }

  public getProductsByCateg(){
     this._ss.getProductsByCateg(this.id).subscribe(
      res=>{this.products=res,
      this.categories[0].isClicked=true
      },
      err=>console.log(err)
    )
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
    stripText(control: FormControl) {
      control.setValue(control.value.replace(/[^0-9]/g, ''));
     }
     public searchProduct(){
      this._ss.searchProduct(this.searchForm.value).subscribe(
        res=>{this.products=res},
        err=>console.log(err)
      )}
    showValuesInInputs(e){
      this.showUpdateForm = true
      this.showAddForm=false
      this.addForm.get('img_url').setValue("", {emitModelToViewChange: false})
      this.selectedFile=new ImageSnippet("",undefined)
      this.controller=false
      this.addForm.reset()
      this.fileName=""
      this.chosenProductId = e.id
      this.chosenProductName = e.name
      this.updateForm.get('name').setValue(e.name) 
      this.updateForm.get('price').setValue(e.price)
      this.updateForm.get('c_id').setValue(e.c_id)
       this.updateForm.get('img_url').setValue(e.img_url)
       this.imageToPreview=e.img_url
       this.notificAddProd=false
      this.notification=false
      this.uploadError=false
      this.productaddError=false
      this.notificUpdateProd=false
      this.productUpdateErr=false
    }
    closeUpdateForm(){
      this.showUpdateForm = false
      this.chosenProductName=""
    }
    close(){
      this.showAddForm = false
      this.addForm.get('img_url').setValue("", {emitModelToViewChange: false})
      this.selectedFile=new ImageSnippet("",undefined)
      this.controller=false
      this.addForm.reset()
      this.fileName=""
    }
    open(){
      this.showAddForm = true
      this.addForm.get('img_url').setValue("", {emitModelToViewChange: false})
      this.controller=true
      this.selectedFile=new ImageSnippet("",undefined)
      this.notificAddProd=false
      this.notification=false
      this.uploadError=false
      this.productaddError=false
      this.chosenProductId=""
      this.notificUpdateProd=false
      this.productUpdateErr=false
    }
    
   
    processFile(imageInput:any){
      const file:File = imageInput.files[0]
      this.fileName=file.name
      const reader = new FileReader()
      reader.addEventListener('load',(event:any)=>{
       this.selectedFile = new ImageSnippet(event.target.result,file)
       this.controller=false
      })
      
      reader.readAsDataURL(file)
      this.addForm.get('img_url').setValue(file.name, {emitModelToViewChange: false})
    
  }
    processFile2(imageInput:any){
      this.controller=true
      const file:File = imageInput.files[0]
      const reader = new FileReader()
      reader.addEventListener('load',(event:any)=>{
       this.selectedFile = new ImageSnippet(event.target.result,file)
       this.controller=false
     
      })
      reader.readAsDataURL(file)
      this.addForm.get('img_url').setValue(file.name, {emitModelToViewChange: false}) 
      this.updateForm.get('img_url').setValue(file.name)
      this.imageToPreview=""
    
  }
 
    private onAddProdSuccess() {
      this.addForm.reset()
      this.showAddForm = false
      this.fileName=""
      this.selectedFile=new ImageSnippet("",undefined)
      this.notificAddProd=true
    }
  
    private onAddProdError() {
      this.addForm.reset()
      this.showAddForm = false
      this.fileName=""
      this.selectedFile=new ImageSnippet("",undefined)
    this.productaddError=true
    }
    public addProduct(){
      this._as.uploadImage(this.selectedFile.file).subscribe(
        (event) => {
          if(event.type === HttpEventType.UploadProgress){
            this.progress = Math.round(event.loaded / event.total * 100);
            // console.log(`Uploaded! ${this.progress}%`);
          }else if(event.type === HttpEventType.Response){
            // console.log('User successfully created!', event.body);
            this.notification = true
          setTimeout(() => {
            this.progress = 0;
          }, 1500);
          }
          
          
          // debugger;
        },
        (err) => {
          this.uploadError=true
        
        })
      this._as.addProduct(this.addForm.value).subscribe(
      res=>{console.log(res),
        this.getProductsByCateg()
        this.onAddProdSuccess()
      },
      err=>{console.log(err),
        this.onAddProdError() 
      }
      )
    }
    public updateProduct(){
      this._as.uploadImage(this.selectedFile.file).subscribe(
        (event) => {
          if(event.type === HttpEventType.UploadProgress){
            this.progress = Math.round(event.loaded / event.total * 100);
            // console.log(`Uploaded! ${this.progress}%`);
         
           
          }else if(event.type === HttpEventType.Response){
            // console.log('User successfully created!', event.body);
            this.notification = true
          setTimeout(() => {
            this.progress = 0;
          }, 1500);
          }
        
        },
        (err) => {
          this.uploadError=true
         
        })
 
      this._as.updateProduct(this.chosenProductId,this.updateForm.value).subscribe(
      res=>{
        this.getProductsByCateg()
        this.notificUpdateProd=true
      },
      err=>{console.log(err)
      this.productUpdateErr=true
      })
    }
   
}
