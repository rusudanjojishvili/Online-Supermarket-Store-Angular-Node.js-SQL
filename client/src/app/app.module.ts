import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MaterialModule} from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {HttpClientModule} from '@angular/common/http'
import {ReactiveFormsModule} from '@angular/forms';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { DialogModalComponent } from './components/dialog-modal/dialog-modal.component';
import { OrderComponent,HighlightSearch } from './components/order/order.component';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { ContactComponent } from './components/contact/contact.component';

// import { MaterialFileInputModule } from 'ngx-material-file-input';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ShoppingComponent,
    DialogModalComponent,
    OrderComponent,
    HighlightSearch,
    DialogConfirmComponent,
    AdminPageComponent,
    ContactComponent,
 
    
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    // MaterialFileInputModule
  ],
  providers: [  {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}],
  bootstrap: [AppComponent],
  entryComponents:[DialogModalComponent,DialogConfirmComponent],
  
    
  
})
export class AppModule {}
