import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface toastContent {
  type: string,
  message: string
} // todo: 

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  showToast = new Subject<toastContent>();
  
  handleSuccess(message: string) {
    let content:toastContent = {
      type: 'success',
      message: message
    };
    this.showToast.next(content);
  }
  
  handleError(message: string) {
    let content:toastContent = {
      type: 'error',
      message: message
    };
    this.showToast.next(content);
  }
}
