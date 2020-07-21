import { Component, OnInit,Inject} from '@angular/core';
import {MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { OrderService } from 'src/app/services/order.service';


@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {
  fileUrl
  file
  cart_id
  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>,@Inject(MAT_DIALOG_DATA) public data:any,public _router:Router
   ,private sanitizer: DomSanitizer,public _os:OrderService) { }

  ngOnInit() {

    // console.log('data',this.data)

   

  }


  download(){
    console.log(this.data.chosenProducts[0].name)
    this._os.download(this.data.chosenProducts).subscribe(
      res=>{
        console.log(res),
        // window.open(window.URL.createObjectURL(res))
        saveAs(res)
        }
      ,err=>console.log(err)
    )
 }
  
  close() {
    this.dialogRef.close();
    this._router.navigateByUrl("/")
}

}
