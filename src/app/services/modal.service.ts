import { Injectable } from '@angular/core';
import { MODALPRODUCT, PRODUCT } from '../interfaces/products.types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  removingProduct = new BehaviorSubject<MODALPRODUCT>({id:1, title:'Product'});

  constructor() { }

  setRemovingProduct(product:PRODUCT) {
    let {title, id} = product;
    this.removingProduct.next({title, id} = product)
  }
}
