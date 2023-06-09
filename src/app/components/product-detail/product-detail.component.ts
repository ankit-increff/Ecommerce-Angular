import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PRODUCT } from '../../interfaces/products.types';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {
  private routeSub: Subscription = new Subscription();
  product !: PRODUCT;
  id!: number;
  quantity!: number;

  constructor(private route:ActivatedRoute, private productService:ProductService, private router:Router, private cartService: CartService, private toastService: ToastService, public util: UtilService, private modalService:ModalService) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.productService.products.subscribe(data => {
        let product = data?.products?.find(prod => prod?.id == this.id);
        if(product) this.product =  product;
        else 
        {
          this.router.navigate(['/']);
          this.toastService.handleError('Product not found!')
        }
      })
    });

    this.cartService.currentCart$.subscribe(data => {
      let cartItem = data.find(item => item?.product?.id == this.id);
      if(cartItem) this.quantity = cartItem?.quantity;
      else this.quantity = 0;
    })
  }

  addToCartHandler() {
    this.cartService.addToCart(this.product?.id, 1);
    this.toastService.handleSuccess('Item added to the cart')
  }

  increaseCartHandler() {
    this.cartService.addToCart(this.id, 1);
    this.toastService.handleSuccess('Item added to the cart')
  }

  decreaseCartHandler() {
    if(this.quantity==1) {
      this.modalService.setRemovingProduct(this.product);
      return;
    }
    this.cartService.addToCart(this.id, -1);
    this.toastService.handleSuccess('Item removed from the cart')
  }

  updateCartHandler($event: any) {
    let value = $event?.target?.value;
    if(!this.util.verifyQuantity(value)) return;

    if(value == '0') {
      this.modalService.setRemovingProduct(this.product);
      return;
    }

    this.cartService.updateCart(this.id, parseInt(value))
    this.cartService.updateCart(this.id, parseInt($event?.target?.value))
    this.toastService.handleSuccess('Item quantity updated successfully')
  }

  refreshQuantity(event: any) {
    event.target.value = this.quantity;
  } 
}
