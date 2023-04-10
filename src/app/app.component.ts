import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { UsersService } from './services/users.service';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecommerce';

  constructor(private productService: ProductService, private usersService: UsersService, private cartService: CartService) {}
  ngOnInit() {
    this.productService.getProducts();
    this.cartInitializer();
  }

  ngAfterViewInit() {
    this.synchronizeServices();
  }

  cartInitializer() {
    if(!localStorage.getItem('cart-data')) localStorage.setItem('cart-data', JSON.stringify({0:{}}));
  }

  synchronizeServices() {
    const currentUserJson = localStorage.getItem('loggedInUser');
    let currUser = undefined;
    if(currentUserJson) currUser = JSON.parse(currentUserJson).name;
    this.usersService.setCurrentUser(currUser);

    //sync cart data
    this.usersService.getCurrentUser().subscribe(data => {
      const cartData = JSON.parse(localStorage.getItem('cart-data') || "");
      if(!data) this.cartService.setCurrentCart(cartData[0]);
      else{
       const email = data.email;
       let currCart  = {};
       if(email in cartData) currCart = cartData[email];
       else {
        cartData[email] = {};
        localStorage.setItem('cart-data', JSON.stringify(cartData));
       }
       this.cartService.setCurrentCart(cartData[email]);
      } 
    })
  }

  getMrp(price: number, discount: number) {
    return ((price * 100) / (100 - discount)).toFixed(2);
  }
}
