import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { product } from '../interfaces/products';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  private routeSub: Subscription = new Subscription();
  constructor(private route:ActivatedRoute, private productService:ProductService, private router:Router, private cartService: CartService) {}

  product !: product;
  id!: number;
  quantity!: number;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.productService.products.subscribe(data => {
        let product = data.products.find(prod => prod.id == this.id);
        if(product) this.product =  product;
        else this.router.navigate(['/']);  //give message: url does not exist
      })
    });

    this.cartService.currentCartData.find(item => {
      if(item.product.id == this.id) {
        this.quantity = item.quantity;
      }
    });  //page navigation safe

    this.cartService.getCurrentCart().subscribe(data => {
      data.find(item => {
        if(item.product.id == this.id) {
          this.quantity = item.quantity;
        }
      })
    })
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }

  addToCartHandler() {
    this.cartService.addToCart(this.product.id, 1);
  }

  increaseCartHandler() {
    this.cartService.addToCart(this.id, 1);
  }

  decreaseCartHandler() {
    this.cartService.addToCart(this.id, -1);
  }

  updateCartHandler($event: any) {
    console.log('updated');
    this.cartService.updateCart(this.id, parseInt($event.target.value))
  }
}
