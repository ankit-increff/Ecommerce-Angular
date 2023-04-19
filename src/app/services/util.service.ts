import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private toastService: ToastService) { }

  verifyQuantity(value: string) {
    if(!/^\d+$/.test(value)) {
      this.toastService.handleError("Quantity must be a positive integer");
      return false;
    }
    return true;
  }
}
