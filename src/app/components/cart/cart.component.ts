import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { PRODUCT } from '../../interfaces/products.types';
import { CARTITEM, SUMMARY } from '../../interfaces/cart.types';
import { CartService } from '../../services/cart.service';
import { ToastService } from 'src/app/services/toast.service';
import { ModalService } from 'src/app/services/modal.service';
import { UtilService } from 'src/app/services/util.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent {
  cartItems: CARTITEM[] = [];
  summary!: SUMMARY;
  totalQuantity = 0;
  orderItems: any = [];

  constructor(private cartService: CartService, private toastService: ToastService, private papa: Papa, private modalService: ModalService, public util: UtilService) { };

  ngOnInit() {
    this.calculateSummary();

    this.cartService.currentCart$.subscribe(data => {
      this.cartItems = data;
      this.calculateSummary();
    })
    this.cartItems?.forEach(item => this.totalQuantity += item.quantity);
    this.cartService.totalQuantity.subscribe(data => {
      this.totalQuantity = data;
    })
  }

  calculateSummary() {
    let tempSummary: SUMMARY = {
      totalMrp: 0,
      discount: 0,
      deliveryCharges: 0,
      amount: 0,
      savings: 0
    };
    this.cartItems?.forEach(item => {
      let product = item?.product;
      tempSummary.amount += product?.price * item?.quantity;
      tempSummary.totalMrp += this.util.getMrp(product?.price, product?.discount) * item?.quantity;
    });

    tempSummary.discount = tempSummary?.totalMrp - tempSummary?.amount;
    if (tempSummary.amount < 1000) {
      tempSummary.deliveryCharges = 49;
      tempSummary.amount += 49;
    }
    tempSummary.savings = tempSummary?.totalMrp - tempSummary?.amount;

    this.summary = tempSummary;
  }

  increaseCartHandler(id: number) {
    this.cartService.addToCart(id, 1);
    this.toastService.handleSuccess('Item added to the cart!')
  }

  decreaseCartHandler(id: number) {
    let tempItem = this.cartItems?.find(item => item?.product?.id == id);
    if (tempItem && tempItem?.quantity == 1) {
      this.modalService.setRemovingProduct(tempItem?.product);
      return;
    }

    this.cartService.addToCart(id, -1);
    this.toastService.handleSuccess('Item removed from the cart!')
  }

  refreshQuantity(id: number, event: any) {
    let tempItem = this.cartItems?.find(item => item?.product?.id == id);
    if (tempItem) event.target.value = tempItem?.quantity;
  }

  updateCartHandler(id: number, $event: any) {
    let value = $event?.target?.value;
    if (!this.util.verifyQuantity(value)) return;
    if (value == '0') {
      let tempItem = this.cartItems?.find(item => item?.product?.id == id);
      if (tempItem) {
        this.modalService.setRemovingProduct(tempItem?.product);
        return;
      }
    }

    this.cartService.updateCart(id, parseInt(value));
    this.toastService.handleSuccess('Cart items updated successfully')
  }

  removeFromCartHandler(product: PRODUCT) {
    this.modalService.setRemovingProduct(product);
  }

  clearCartHandler() {
    this.cartService.clearCart();
    this.toastService.handleSuccess('Cart has been cleared')
  }

  placeOrderHandler() {
    this.cartItems?.forEach(item => {
      this.orderItems?.push({
        sku_id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        quantity: item?.quantity
      })
    });
    this.util.downloadOrder(this.orderItems);
    this.toastService.handleSuccess('Order has been placed successfully');
    this.cartService.clearCart();
  }

  downloadAgain() {
    this.util.downloadOrder(this.orderItems);
    this.toastService.handleSuccess('Order has been downloaded again!');
  }
}
