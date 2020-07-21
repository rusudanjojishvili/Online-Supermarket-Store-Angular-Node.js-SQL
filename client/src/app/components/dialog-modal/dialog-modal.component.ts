import { Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-dialog-modal',
  templateUrl: './dialog-modal.component.html',
  styleUrls: ['./dialog-modal.component.css']
})
export class DialogModalComponent implements OnInit {
  url:string="http://localhost:1000/public/uploads/"
  form:FormGroup
  quantity:number
  

  constructor(public dialogRef: MatDialogRef<DialogModalComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public _fb:FormBuilder) {
    this.quantity = data.quantity
   }
  

  ngOnInit() {
    this.form = this._fb.group({
      quantity:[1,Validators.required],
      product_id:this.data.p_id
    
    })
  }
  add(){
  
  console.log(this.form.value)
 
  this.dialogRef.close(this.form.value)
  }
  close() {
    this.dialogRef.close();
}
}
