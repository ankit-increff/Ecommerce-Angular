import { Injectable } from '@angular/core';
import { modalProduct, product } from '../interfaces/products';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  removingProduct = new BehaviorSubject<modalProduct>({id:1, title:'Product'});

  setRemovingProduct(product:product) {
    let {title, id} = product;
    this.removingProduct.next({title, id} = product)
  }
}
