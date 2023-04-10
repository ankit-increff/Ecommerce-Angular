import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { product } from '../interfaces/products';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  private routeSub: Subscription = new Subscription();
  constructor(private route:ActivatedRoute, private productService:ProductService) {}

  product !: product;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.productService.products.subscribe(data => {
        let product = data.products.find(prod => prod.id == id);
        if(product) this.product =  product;
        console.log(data.products);
      })
    });
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }
}
