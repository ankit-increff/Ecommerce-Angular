import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PRODUCT, PRODUCTJSON } from '../interfaces/products.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  products !: Observable<PRODUCTJSON>;
  productsData!: PRODUCT[];

  constructor(private http:HttpClient) { }
  
  getProducts() {
    this.products = this.http.get<PRODUCTJSON>('../../assets/json/products.json');
    this.products.subscribe(data => {
      this.productsData = data?.products;
    })
  }
}
