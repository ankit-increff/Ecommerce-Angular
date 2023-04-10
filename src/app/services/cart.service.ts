import { Injectable } from '@angular/core';
import { cartItem} from '../interfaces/cart'
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() { }

  currentCart = new Subject<cartItem[]>();

  setCurrentCart(cartItems : cartItem[]) {
    this.currentCart.next(cartItems);
  }

  getCurrentCart():Observable<cartItem[]> {
    return this.currentCart.asObservable();
  }

}
