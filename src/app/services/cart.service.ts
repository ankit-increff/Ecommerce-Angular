import { Injectable } from '@angular/core';
import { CARTDATA, CARTITEM, ITEMMAP} from '../interfaces/cart.types'
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';
import { ProductService } from './product.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  currentCart = new BehaviorSubject<CARTITEM[]>([]);
  currentCart$ = this.currentCart.asObservable();
  currentCartData:CARTITEM[] = [];
  totalQuantity = new Subject<number>();
  
  constructor(private usersService: UsersService, private productService: ProductService, private toastService: ToastService) { }

  setCurrentCart(cartItems: CARTITEM[]) {
    this.currentCart.next(cartItems);
    this.currentCartData = cartItems;
    let quantity = cartItems?.reduce((sum, item) => sum + item?.quantity, 0);
    this.totalQuantity.next(quantity);
  }

  getCurrentCart():Observable<CARTITEM[]> {
    return this.currentCart.asObservable();
  }


  cartSynchronize(email:string) {
    let cartDataJson = localStorage.getItem('cart-data');
    let cartData:CARTDATA = {'guest': {}};
    try {
      cartData = JSON.parse(cartDataJson || '');
    } catch (error) {
      this.toastService.handleError("Unhandled exception: Cart has been tampered!")
      localStorage.removeItem('cart-data');
    }

    if(!cartData?.['guest']) cartData['guest'] = {};
    if (!(email in cartData)) {
      cartData[email] = cartData?.['guest'];
    }

    let userCart = cartData?.[email],
    localCart = cartData?.['guest'];
    if(email!='guest') {
      userCart = this.mergeCarts(userCart, localCart);
      cartData['guest'] = {};
      cartData[email] = userCart;
    }
    localStorage.setItem('cart-data', JSON.stringify(cartData));

    this.productService.products.subscribe(data => {
      let products = data?.products;
      let items:CARTITEM[] = [];
      for(let id in userCart) {
        let product = products?.find(p => p?.id == parseInt(id));
        if(product) items?.push({ product, quantity: userCart[id] });
      }
      this.setCurrentCart(items);
    })
  }
  
  mergeCarts(userCart: ITEMMAP, localCart: ITEMMAP): ITEMMAP {
    for(let i in localCart) {
      if(userCart.hasOwnProperty(i)) userCart[i]+= localCart?.[i];
      else userCart[i] = localCart?.[i];
    }
    return userCart;
  }

  addToCart(id:number, quantity:number):void {
    let cartData = JSON.parse(localStorage.getItem('cart-data') || ''),
    email = this.usersService.userData?.email,
    userCart = cartData?.[email];

    if(id in userCart) {
      userCart[id] += quantity;
    } else{
      userCart[id] = quantity;
    }

    cartData[email]=userCart;
    localStorage.setItem('cart-data', JSON.stringify(cartData));
    
    let products = this.productService.productsData;
    let items:CARTITEM[] = [];
    for(let id in userCart) {
      let product = products?.find(p => p?.id == parseInt(id));
      if(product) items?.push({ product, quantity: userCart?.[id] });
    }
    this.setCurrentCart(items);
  }

  updateCart(id:number, quantity:number) {
    let cartData = JSON.parse(localStorage.getItem('cart-data') || ''),
    email = this.usersService.userData?.email,
    userCart = cartData[email];

    userCart[id] = quantity;

    cartData[email]=userCart;
    localStorage.setItem('cart-data', JSON.stringify(cartData));
    
    let products = this.productService.productsData;
    let items:CARTITEM[] = [];
    for(let id in userCart) {
      let product = products?.find(p => p?.id == parseInt(id));
      if(product) items?.push({ product, quantity: userCart?.[id] });
    }
    this.setCurrentCart(items);
  }

  removeFromCart(id:number) {
    let cartData = JSON.parse(localStorage.getItem('cart-data') || ''),
    email = this.usersService.userData.email,
    userCart = cartData[email];

    delete userCart?.[id];
    cartData[email]=userCart;
    localStorage.setItem('cart-data', JSON.stringify(cartData));

    let newCartItems = [...this.currentCartData?.filter(item => item?.product?.id != id)];
    this.setCurrentCart(newCartItems);
  }

  clearCart() {
    let cartData = JSON.parse(localStorage.getItem('cart-data') || ''),
    email = this.usersService.userData?.email;
    cartData[email]={};
    localStorage.setItem('cart-data', JSON.stringify(cartData));
    this.setCurrentCart([]);
  }
}