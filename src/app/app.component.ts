import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { UsersService } from './services/users.service';
import { CartService } from './services/cart.service';
import { CARTITEM, ITEMMAP } from './interfaces/cart.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private productService: ProductService, private usersService: UsersService, private cartService: CartService) { }
  ngOnInit() {
    this.cartInitializer();
    this.productService.getProducts();
    this.synchronizeServices();
  }

  cartInitializer() {
    if (!localStorage.getItem('cart-data')) localStorage.setItem('cart-data', JSON.stringify({ 'guest': {} }));
  }

  synchronizeServices() {
    this.synchronizeUser();
    this.usersService.getCurrentUser$.subscribe(data => {
      this.cartSynchronize(data?.email);
    })
  }

  synchronizeUser() {
    const currentUserJson = localStorage.getItem('loggedInUser');
    let currUser = { email: 'guest', name: "Guest" };
    if (currentUserJson) currUser = JSON.parse(currentUserJson);
    this.usersService.setCurrentUser(currUser);
    return currUser?.email;
  }

  cartSynchronize(email:string) {
    let cartData = JSON.parse(localStorage.getItem('cart-data') || "");
    if(!cartData['guest']) cartData['guest'] = {};
    if (!(email in cartData)) {
      cartData[email] = cartData['guest'];
    }

    let userCart = cartData?.[email],
    localCart = cartData['guest'];
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
      this.cartService.setCurrentCart(items);
    })
  }

  mergeCarts(userCart: ITEMMAP, localCart: ITEMMAP): ITEMMAP {
    for(let i in localCart) {
      if(userCart.hasOwnProperty(i)) userCart[i]+= localCart?.[i];
      else userCart[i] = localCart?.[i];
    }
    return userCart;
  }
}
