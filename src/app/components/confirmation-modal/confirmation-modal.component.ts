import { Component, ElementRef, ViewChild } from '@angular/core';
import { modalProduct } from 'src/app/interfaces/Products.types';
import { CartService } from 'src/app/services/cart.service';
import { ModalService } from 'src/app/services/modal.service';
import { ToastService } from 'src/app/services/toast.service';
declare var bootstrap: any;

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  constructor(private cartService: CartService, private modalService: ModalService, private toastService: ToastService) {} 

  product!: modalProduct;

  confirmModal!:any;

  @ViewChild('confirmRemoveModal') confirmModalRef!: ElementRef;
  ngAfterViewInit() {
    this.confirmModal = new bootstrap.Modal(this.confirmModalRef.nativeElement);
  }

  ngOnInit() {
    this.modalService.removingProduct.subscribe(data => {
      this.product = data;
      this.confirmModal.show();
    })
  }
  
  removeFromCartHandler(id:number) {
    this.cartService.removeFromCart(id);
    this.toastService.handleSuccess("Item removed from the cart!")
  }
}
