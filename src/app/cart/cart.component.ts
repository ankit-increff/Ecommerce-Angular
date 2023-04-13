import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../interfaces/products';
import { CartService } from '../services/cart.service';
import { cartItem, summary } from '../interfaces/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent {
  repeat = Array(8).fill(0);

  constructor(private cartService: CartService) {};
     
  cartItems: cartItem[] = [];
  summary!:summary;

  ngOnInit() {
    this.cartItems = this.cartService.currentCartData;
    this.calculateSummary(); //page navigation safe

    this.cartService.getCurrentCart().subscribe(data => {
      console.log(data);
      this.cartItems = data;
      this.calculateSummary();
    })    
  }

  calculateSummary() {
    let tempSummary:summary = {
      totalMrp: 0,
      discount: 0,
      deliveryCharges: 0,
      amount: 0,
      savings: 0

    };
    this.cartItems.forEach(item => {
      let product = item.product;
      tempSummary.amount+=product.price;
      tempSummary.totalMrp+=this.getMrp(product.price, product.discount);
    });

    tempSummary.discount = tempSummary.totalMrp-tempSummary.amount;
    if(tempSummary.amount < 1000) {
      tempSummary.deliveryCharges = 49;
      tempSummary.amount += 49;
    }
    tempSummary.savings = tempSummary.totalMrp - tempSummary.amount;

    this.summary = tempSummary;
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }



}
