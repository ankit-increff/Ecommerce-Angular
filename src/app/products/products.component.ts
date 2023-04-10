import { Component } from '@angular/core';
import {NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../services/product.service';
import { product } from '../interfaces/products';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  closeResult = '';

	constructor(private offcanvasService: NgbOffcanvas, private productService:  ProductService) {}

  products: product[] = [];
  ngOnInit() {
    this.productService.products.subscribe(data => {
      this.products = data.products;
    })
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }

	open(content:any) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
	}

  sort= 'Relevance';
}
