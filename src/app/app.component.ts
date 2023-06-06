import { Component } from '@angular/core';
import { ProductService } from './services/product.service';
import { UsersService } from './services/users.service';
import { CartService } from './services/cart.service';

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
      this.cartService.cartSynchronize(data?.email);
    })
  }

  synchronizeUser() {
    const currentUserJson = localStorage.getItem('loggedInUser');
    let currUser = { email: 'guest', name: "Guest" };
    if (currentUserJson) currUser = JSON.parse(currentUserJson);
    this.usersService.setCurrentUser(currUser);
    return currUser?.email;
  }
}
