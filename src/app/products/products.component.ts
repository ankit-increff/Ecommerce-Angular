import { Component } from '@angular/core';
import {NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../services/product.service';
import { product } from '../interfaces/products';
import { UsersService } from '../services/users.service';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  closeResult = '';

	constructor(private offcanvasService: NgbOffcanvas, private productService:  ProductService, private usersService: UsersService, private cartService:CartService) {}

  currentUserEmail:string = '0';
  products: product[] = [];
  ngOnInit() {
    this.productService.products.subscribe(data => {
      this.products = data.products;
    })
    this.usersService.getCurrentUser().subscribe(data => {
      this.currentUserEmail = data.email;
    })
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }

	open(content:any) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
	}

  addToCartHandler($event: any, product:product) {
    $event.stopPropagation();
    this.cartService.addToCart(product, 1);
  }

  sort= 'Relevance';
}
