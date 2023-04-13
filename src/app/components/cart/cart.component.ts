import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { product } from '../../interfaces/products';
import { CartService } from '../../services/cart.service';
import { cartItem, summary } from '../../interfaces/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent {
  constructor(private cartService: CartService) {};
     
  cartItems: cartItem[] = [];
  summary!:summary;
  removingProduct!: product;
  totalQuantity = 0;

  ngOnInit() {
    this.cartItems = this.cartService.currentCartData;
    this.calculateSummary(); //page navigation safe

    this.cartService.getCurrentCart().subscribe(data => {
      console.log(data);
      this.cartItems = data;
      this.calculateSummary();
    }) 
    this.cartItems.forEach(item => this.totalQuantity += item.quantity);
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
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
    console.log(this.cartItems);
    this.cartItems.forEach(item => {
      let product = item.product;
      tempSummary.amount+=product.price*item.quantity;
      tempSummary.totalMrp+=this.getMrp(product.price, product.discount)*item.quantity;
    });

    tempSummary.discount = tempSummary.totalMrp-tempSummary.amount;
    if(tempSummary.amount < 1000) {
      tempSummary.deliveryCharges = 49;
      tempSummary.amount += 49;
    }
    tempSummary.savings = tempSummary.totalMrp - tempSummary.amount;

    this.summary = tempSummary;
    console.log(this.summary);
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }

  increaseCartHandler(id: number) {
    this.cartService.addToCart(id, 1);
  }

  decreaseCartHandler(id: number) {
    this.cartService.addToCart(id, -1);
  }

  updateCartHandler(id:number, $event: any) {
    console.log('updated');
    this.cartService.updateCart(id, parseInt($event.target.value))
  }

  setRemovingProduct(product: product)  {
    this.removingProduct=product;
  }

  removeFromCartHandler() {
    console.log('removing', this.removingProduct);
    this.cartService.removeFromCart(this.removingProduct.id);
  }

  clearCartHandler() {
    this.cartService.clearCart();
  }


}
