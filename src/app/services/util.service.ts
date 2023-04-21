import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private toastService: ToastService, private papa: Papa) { }

  verifyQuantity(value: string) {
    if(!/^\d+$/.test(value)) {
      this.toastService.handleError("Quantity must be a positive integer");
      return false;
    }
    return true;
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }

  downloadOrder(orderItems:any) {
    let data = this.papa.unparse(orderItems, {
      quoteChar: '$',
      delimiter: ","
    }),
    blob = new Blob([data], { type: 'text/csv;charset=utf-8;' }),
    fileUrl = null;
    
    if (navigator.msSaveBlob) {
      fileUrl = navigator.msSaveBlob(blob, 'download.csv');
    } else {
      fileUrl = window.URL.createObjectURL(blob);
    }
    
    let tempLink = document.createElement('a');
    tempLink.href = fileUrl;
    tempLink.setAttribute('download', 'download.csv');
    tempLink.click();
    tempLink.remove();
  }
}
