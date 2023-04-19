import { Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';
import { product, quantityArray } from '../../interfaces/products';
import { UsersService } from '../../services/users.service';
import { CartService } from '../../services/cart.service';
import { FilterService } from 'src/app/services/filter.service';
import { filter } from 'src/app/interfaces/cart';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  closeResult = '';
  constructor(private offcanvasService: NgbOffcanvas, private productService: ProductService, private usersService: UsersService, private cartService: CartService, private filterService: FilterService, private toastService: ToastService) { }
  
  products: product[] = [];
  quantities: quantityArray = {}
  intMax = 1e9+7;
  intMin = -1;
  priceFilterErrorMessage = '';
  //handle price filters and session storage change
  filters:filter = {
    minPrice: -1,
    maxPrice: 1e9+7,
    brands:[] as string[],
    rating: 0,
    sortBy: 'Relevance'
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
      this.applyFilters();
    })

    this.cartService.currentCartData.forEach(item => {
      this.quantities[item.product.id] = item.quantity;
    });  //page navigation safe

    this.cartService.currentCart$.subscribe(data => {
      data.forEach(item => {
        this.quantities[item.product.id] = item.quantity;
      })
      console.log("prod - syncedCart", this.quantities);
    })

    let filters = this.filterService.getAllFilters();
    if(filters) this.filters = filters;
    this.applyFilters();
  }

  triggerToast(message: string) {
    this.toastService.handleSuccess(message);
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
    this.toastService.handleSuccess('Item added to the cart')
  }
  
  increaseCartHandler(id: number) {
    this.cartService.addToCart(id, 1);
    this.toastService.handleSuccess('Item added to the cart')
    
  }
  
  decreaseCartHandler(id: number) {
    this.cartService.addToCart(id, -1);
    this.toastService.handleSuccess('Item removed from the cart')
    
  }

  updateCartHandler(id:number, $event: any) {
    console.log('updated');
    this.cartService.updateCart(id, parseInt($event.target.value))
    this.toastService.handleSuccess('Cart items updated successfully')
  }

  changeSorting(sort: string) {
    this.filters.sortBy = sort;
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
    if(this.priceFilterError()) return;
    this.applySorting(this.filters.sortBy);
    if(this.filters.minPrice) this.products = this.products.filter(product => product.price >= (this.filters.minPrice || 0));
    if(this.filters.maxPrice) this.products = this.products.filter(product => product.price <= (this.filters.maxPrice|| 999999));
    if(this.filters.rating) this.products = this.products.filter(product => product.rating >= (this.filters.rating || 0))
    if(this.filters.brands.length) this.products = this.products.filter(product =>this.filters.brands.includes(product.brand));
    
    this.filterService.setFilters(this.filters);
  }

  changeMinPrice(event:any) {
    this.filters.minPrice = event.target.value;
    this.applyFilters();
  }
  
  changeMaxPrice(event:any) {
    this.filters.maxPrice = event.target.value
    this.applyFilters();
  }

  ratingChangeHandler(event:any) {
    this.filters.rating = parseInt(event.target.value)
    this.applyFilters();
  } 

  brandChangeHandler(event:any) {
    let target = event.target
    if(target.checked) {
      this.filters.brands.push(target.value);
    } else {
      this.filters.brands = [...this.filters.brands].filter(brand => brand != target.value);
    }
    this.applyFilters();
  }

  clearFilters() {
    this.filterService.clearFilters();
    this.filters = this.filterService.getAllFilters();
    this.applyFilters();
  }

  priceFilterError() {
    let mx = this.filters.maxPrice,
    mn = this.filters.minPrice;
    // if(!mx && !mn) return false;
    // if(mx==this.intMax && mn==this.intMin) return false;

    if(mx && mx!=this.intMax && !(/^\d+$/.test(mx.toString()))) {
      this.priceFilterErrorMessage = "Max Price must be a positive integer"
      return true;
    } else if(mn && mn!=this.intMin && !(/^\d+$/.test(mn.toString()))) {
      this.priceFilterErrorMessage = "Min Price must be a positive integer"
      return true;
    } else if(mx && mn && mx-mn<0) {
      this.priceFilterErrorMessage = "Min Price should not be greater than max price"
      return true;
    }
    return false;
    
  }
}
