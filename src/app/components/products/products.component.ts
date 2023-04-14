import { Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';
import { product, quantityArray } from '../../interfaces/products';
import { UsersService } from '../../services/users.service';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  closeResult = '';
  
  constructor(private offcanvasService: NgbOffcanvas, private productService: ProductService, private usersService: UsersService, private cartService: CartService) { }
  
  products: product[] = [];
  quantities: quantityArray = {}
  sortBy = 'Relevance';
  filters = {
    minPrice: undefined,
    maxPrice: undefined,
    brands:[] as string[],
    rating: 0
  }
  allBrands:string[] = [];

  ngOnInit() {
    console.log('prodInitStarted');
    this.productService.products.subscribe(data => {
      console.log('subscribed');
      this.products = data.products;
      this.allBrands = this.products.map(product => product.brand)
      this.allBrands = [...new Set(this.allBrands)];
      console.log("prod - syncedProducts");
    })

    this.cartService.currentCartData.forEach(item => {
      this.quantities[item.product.id] = item.quantity;
    });  //page navigation safe

    this.cartService.getCurrentCart().subscribe(data => {
      data.forEach(item => {
        this.quantities[item.product.id] = item.quantity;
      })
      console.log("prod - syncedCart", this.quantities);
    })
  }

  getMrp(price: number, discount: number) {
    return (price * 100) / (100 - discount);
  }

  open(content: any) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
  }

  addToCartHandler($event: any, product: product) {
    $event.stopPropagation();
    this.cartService.addToCart(product.id, 1);
  }
  
  increaseCartHandler(id: number) {
    this.cartService.addToCart(id, 1);
  }

  decreaseCartHandler(id: number) {
    this.cartService.addToCart(id, -1);
  }

  updateCartHandler(id:number, $event: any) {
    console.log('updated');
    this.cartService.updateCart(id, parseInt($event.target.value))
  }

  changeSorting(sort: string) {
    this.sortBy = sort;
    this.applyFilters();
  }

  applySorting(sort:string) {
    this.products = [...this.productService.productsData];
    switch (sort) {
      case 'Relevance':
        this.products = this.productService.productsData
        break;
      case 'Price low to high':
        this.products = this.products.sort((a:product, b:product) => a.price - b.price);
        break;
        case 'Price high to low':
          this.products = this.products.sort((a:product, b:product) => b.price - a.price);
          break;
        case 'Ratings':
          this.products = this.products.sort((a:product, b:product) => b.rating - a.rating);
          break;
    }
  }

  applyFilters() {
    this.applySorting(this.sortBy);
    if(this.filters.minPrice) this.products = this.products.filter(product => product.price >= (this.filters.minPrice || 0));
    if(this.filters.maxPrice) this.products = this.products.filter(product => product.price <= (this.filters.maxPrice|| 999999));
    if(this.filters.rating) this.products = this.products.filter(product => product.rating >= (this.filters.rating || 0))
    console.log(this.products, this.filters.brands);
    if(this.filters.brands.length) this.products = this.products.filter(product =>this.filters.brands.includes(product.brand));
  }

  changeMinPrice(event:any) {
    this.filters.minPrice = event.target.value;
    this.applyFilters();
  }
  
  changeMaxPrice(event:any) {
    this.filters.maxPrice = event.target.value
    this.applyFilters();
  }

  ratingChangeHandler(data:any) {
    this.filters.rating = parseInt(data.rating)
    this.applyFilters();
  } 

  brandChangeHandler(data:any) {
    let brandFilters:string[] = [];
    for(let i in data) {
      if(data[i] ==true) brandFilters.push(i);
    }
    this.filters.brands = brandFilters;
    this.applyFilters();
  }
}
