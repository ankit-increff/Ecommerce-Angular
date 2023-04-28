import { Component, ElementRef, ViewChild } from '@angular/core';
import { MODALPRODUCT } from 'src/app/interfaces/products.types';
import { CartService } from 'src/app/services/cart.service';
import { ModalService } from 'src/app/services/modal.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  product!: MODALPRODUCT;
  @ViewChild('modalToggleBtn') modalToggleBtnRef!: ElementRef;

  constructor(private cartService: CartService, private modalService: ModalService, private toastService: ToastService) {} 

  ngOnInit() {
    this.modalService.removingProduct.subscribe(data => {
      this.product = data;
      this.modalToggleBtnRef.nativeElement.click();
    })
  }
  
  removeFromCartHandler(id:number) {
    this.cartService.removeFromCart(id);
    this.toastService.handleSuccess("Item removed from the cart!")
  }
}
