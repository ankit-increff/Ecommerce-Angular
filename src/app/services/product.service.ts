import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { productJson } from '../interfaces/products';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  products !: Observable<productJson>;
  
  getProducts() {
    this.products = this.http.get<productJson>('../../assets/json/products.json');
  }
}
