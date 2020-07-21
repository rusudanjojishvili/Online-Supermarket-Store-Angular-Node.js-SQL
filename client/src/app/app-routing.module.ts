import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShoppingComponent } from './components/shopping/shopping.component';
import { OrderComponent } from './components/order/order.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { ContactComponent } from './components/contact/contact.component';


const routes: Routes = [
  {path:"",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"contact",component:ContactComponent},
  {path:"shop",component:ShoppingComponent},
  {path:"order",component:OrderComponent},
  {path:"admin",component:AdminPageComponent},
  // {path:"order",component:OrderComponent},
  // {path:"products",component:ShoppingComponent},
  {path:"**", redirectTo:"login"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
