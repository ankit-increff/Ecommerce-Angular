import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { UsersService } from './services/users.service';
import { CartService } from './services/cart.service';
import { cartItem, itemMap } from './interfaces/Cart.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ecommerce';

  constructor(private productService: ProductService, private usersService: UsersService, private cartService: CartService) { }
  ngOnInit() {
    this.cartInitializer();
    this.productService.getProducts();
    this.synchronizeServices();
  }

  cartInitializer() {
    if (!localStorage.getItem('cart-data')) localStorage.setItem('cart-data', JSON.stringify({ 0: {} }));
  }

  synchronizeServices() {
    this.synchronizeUser();
    this.usersService.getCurrentUser$.subscribe(data => {
      this.cartSynchronize(data.email);
    })
  }

  synchronizeUser() { //try-catch
    const currentUserJson = localStorage.getItem('loggedInUser');
    let currUser = { email: '0', name: "Guest" };
    if (currentUserJson) currUser = JSON.parse(currentUserJson);
    this.usersService.setCurrentUser(currUser);
    return currUser.email;
  }

  cartSynchronize(email:string) {
    let cartData = JSON.parse(localStorage.getItem('cart-data') || "");

    if(!cartData[0]) cartData[0] = {};

    if (!(email in cartData)) {
      cartData[email] = cartData[0];
    }

    let userCart = cartData[email],
    localCart = cartData[0];

    if(email!='0') {
      userCart = this.mergeCarts(userCart, localCart);
      cartData[0] = {};
      cartData[email] = userCart;
    }
    localStorage.setItem('cart-data', JSON.stringify(cartData));

    this.productService.products.subscribe(data => {
      let products = data.products;
      let items:cartItem[] = [];
      for(let id in userCart) {
        let product = products.find(p => p.id == parseInt(id));
        if(product) items.push({ product, quantity: userCart[id] });
      }
      this.cartService.setCurrentCart(items);
    })
  }

  mergeCarts(userCart: itemMap, localCart: itemMap): itemMap {
    for(let i in localCart) {
      if(userCart.hasOwnProperty(i)) userCart[i]+= localCart[i];
      else userCart[i] = localCart[i];
    }
    return userCart;
  }

  getMrp(price: number, discount: number) {
    return ((price * 100) / (100 - discount)).toFixed(2);
  }
}
