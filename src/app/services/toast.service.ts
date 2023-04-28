import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TOASTCONTENT } from '../interfaces/toast.types';


@Injectable({
  providedIn: 'root'
})
export class ToastService {
  showToast = new Subject<TOASTCONTENT>();

  constructor() { }
  
  handleSuccess(message: string) {
    let content:TOASTCONTENT = {
      type: 'success',
      message: message
    };
    this.showToast.next(content);
  }
  
  handleError(message: string) {
    let content:TOASTCONTENT = {
      type: 'error',
      message: message
    };
    this.showToast.next(content);
  }
}
