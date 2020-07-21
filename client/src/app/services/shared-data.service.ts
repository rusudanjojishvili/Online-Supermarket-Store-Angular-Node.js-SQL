import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private usernameSource = new BehaviorSubject(sessionStorage.u);
  currentUsername = this.usernameSource.asObservable();

  private tokenSource = new BehaviorSubject(sessionStorage.token);
  currentToken = this.tokenSource.asObservable();

  private productQSource = new BehaviorSubject(sessionStorage.pN);
  currentpQ= this.productQSource.asObservable();

  private cartIdSource = new BehaviorSubject(sessionStorage.pN);
  currentcartId= this.cartIdSource.asObservable();

  private totalPriceSource = new BehaviorSubject(sessionStorage.totalPrice);
  currenttotalPrice= this.totalPriceSource.asObservable();

  private ordersQSource = new BehaviorSubject(sessionStorage.ordersQ);
  currentOrdersQ= this.ordersQSource.asObservable();

  private isAdminSource = new BehaviorSubject(sessionStorage.isAdmin);
  currentIsAdmin= this.isAdminSource.asObservable();

  private cartCreationDateSrc = new BehaviorSubject(sessionStorage.creation_date);
  currentCreationDate= this.cartCreationDateSrc.asObservable();

  constructor() { }

  
  public showUsername(username: string) {
    this.usernameSource.next(username)
  }
  public getToken(token:string){
    this.tokenSource.next(token)
  }
  public getpQ(pQ){
    this.productQSource.next(pQ)
  }
  public getcartId(cartId:any){
    this.cartIdSource.next(cartId)
  }
  public getTotalPrice(totalPrice){
    this.totalPriceSource.next(totalPrice)
  }
  public getordersQ(oQ){
    this.ordersQSource.next(oQ)
  }
  public isAdmin(isAdmin){
    this.isAdminSource.next(isAdmin)

  }
  public getCreationDate(creation_date){
    this.cartCreationDateSrc.next(creation_date)

  }

} 
