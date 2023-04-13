import { Injectable } from '@angular/core';
import { cartItem, itemMap} from '../interfaces/cart'
import { Observable, Subject } from 'rxjs';
import { UsersService } from './users.service';
import { product } from '../interfaces/products';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private usersService: UsersService, private productService: ProductService) { }

  currentCart = new Subject<cartItem[]>();
  currentCartData:cartItem[] = [];
  totalQuantity = new Subject<number>();

  setCurrentCart(cartItems: cartItem[]) {
    this.currentCart.next(cartItems);
    this.currentCartData = cartItems;
    let quantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.totalQuantity.next(quantity);
  }

  getCurrentCart():Observable<cartItem[]> {
    return this.currentCart.asObservable();
  }

  addToCart(id:number, quantity:number) {
    let cartData = JSON.parse(localStorage.getItem('cart-data') || ''),
    email = this.usersService.userData.email,
    userCart = cartData[email];

    if(id in userCart) {
      userCart[id] += quantity;
    } else{
      userCart[id] = quantity;
    }

    cartData[email]=userCart;
    localStorage.setItem('cart-data', JSON.stringify(cartData));
    
    // usercart -> cartitems[]
    let products = this.productService.productsData;
    let items:cartItem[] = [];
    for(let id in userCart) {
      let product = products.find(p => p.id == parseInt(id));
      if(product) items.push({ product, quantity: userCart[id] });
    }
    this.setCurrentCart(items);
  }

  updateCart(id:number, quantity:number) {
    let cartData = JSON.parse(localStorage.getItem('cart-data') || ''),
    email = this.usersService.userData.email,
    userCart = cartData[email];

    userCart[id] = quantity;

    cartData[email]=userCart;
    localStorage.setItem('cart-data', JSON.stringify(cartData));
    
    // usercart -> cartitems[]
    let products = this.productService.productsData;
    let items:cartItem[] = [];
    for(let id in userCart) {
      let product = products.find(p => p.id == parseInt(id));
      if(product) items.push({ product, quantity: userCart[id] });
    }
    this.setCurrentCart(items);
  }

  getTotalQuantity(){
    this.getCurrentCart().subscribe(data => {
      return Object.keys(data).length;
    })
  }


}
