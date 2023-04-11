import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../interfaces/products';
import { CartService } from '../services/cart.service';
import { cartItem } from '../interfaces/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  repeat = Array(8).fill(0);

  constructor(private cartService: CartService) {};
     
  cartItems: cartItem[] = [];
  ngOnInit() {
    this.cartService.getCurrentCart().subscribe(data => {
      this.cartItems = data;
      console.log(data);
    })    
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }



}
