import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { UsersService } from './services/users.service';
import { CartService } from './services/cart.service';
import { cartItem } from './interfaces/cart';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce';

  constructor(private productService: ProductService, private usersService: UsersService, private cartService: CartService) { }
  ngOnInit() {
    this.cartInitializer();
    this.productService.getProducts();
    this.synchronizeServices();
  }

  ngAfterViewInit() {
  }

  cartInitializer() {
    if (!localStorage.getItem('cart-data')) localStorage.setItem('cart-data', JSON.stringify({ 0: {} }));
  }

  synchronizeServices() {
    const email = this.synchronizeUser();
    this.cartSynchronize(email);
  }

  synchronizeUser() {
    const currentUserJson = localStorage.getItem('loggedInUser');
    let currUser = { email: '0', name: "Guest" };
    if (currentUserJson) currUser = JSON.parse(currentUserJson);
    this.usersService.setCurrentUser(currUser);
    console.log("syncedUserService");
    return currUser.email;
  }

  cartSynchronize(email:string) {
    const cartData = JSON.parse(localStorage.getItem('cart-data') || "");
    if (!(email in cartData)) {
      cartData[email] = {};
      localStorage.setItem('cart-data', JSON.stringify(cartData));
    }
    const userCart = cartData[email];
    this.productService.products.subscribe(data => {
      let products = data.products;
      let items:cartItem[] = [];
      for(let id in userCart) {
        let product = products.find(p => p.id == parseInt(id));
        if(product) items.push({ product, quantity: userCart[id] });
      }
      this.cartService.setCurrentCart(items);
      console.log('syncedCartService', items);
    })
  }

  getMrp(price: number, discount: number) {
    return ((price * 100) / (100 - discount)).toFixed(2);
  }
}
