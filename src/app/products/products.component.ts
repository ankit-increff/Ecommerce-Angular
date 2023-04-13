import { Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../services/product.service';
import { product, quantityArray } from '../interfaces/products';
import { UsersService } from '../services/users.service';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  closeResult = '';

  constructor(private offcanvasService: NgbOffcanvas, private productService: ProductService, private usersService: UsersService, private cartService: CartService) { }

  products: product[] = [];
  quantities: quantityArray = {}
  ngOnInit() {
    console.log('prodInitStarted');
    this.productService.products.subscribe(data => {
      this.products = data.products;
      console.log("prod - syncedProducts");
    })

    this.cartService.currentCartData.forEach(item => {
      this.quantities[item.product.id] = item.quantity;
    });  //page navigation safe

    this.cartService.getCurrentCart().subscribe(data => {
      data.forEach(item => {
        this.quantities[item.product.id] = item.quantity;
      })
      console.log("prod - syncedCart", this.quantities);
    })
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }

  open(content: any) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
  }

  addToCartHandler($event: any, product: product) {
    $event.stopPropagation();
    this.cartService.addToCart(product.id, 1);
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

  sort = 'Relevance';
}
// todo update cart handler