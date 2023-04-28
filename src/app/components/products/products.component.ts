import { Component } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../../services/product.service';
import { PRODUCT, QUANTITYARRAY } from '../../interfaces/products.types';
import { CartService } from '../../services/cart.service';
import { FilterService } from 'src/app/services/filter.service';
import { FILTER } from 'src/app/interfaces/cart.types';
import { ToastService } from 'src/app/services/toast.service';
import { UtilService } from 'src/app/services/util.service';
import { ModalService } from 'src/app/services/modal.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  closeResult = '';
  products: PRODUCT[] = [];
  quantities: QUANTITYARRAY = {}
  intMax = 1e9 + 7;
  intMin = -1;
  filters: FILTER = {
    minPrice: this.intMin,
    maxPrice: this.intMax,
    brands: [] as string[],
    rating: 0,
    sortBy: 'Relevance'
  }
  allBrands: string[] = [];

  constructor(private offcanvasService: NgbOffcanvas, private productService: ProductService, private cartService: CartService, private filterService: FilterService, private toastService: ToastService, public util: UtilService, private modalService: ModalService) { }

  ngOnInit() {
    this.productService.products.subscribe(data => {
      this.products = data?.products;
      this.allBrands = this.products?.map(product => product?.brand)
      this.allBrands = [...new Set(this?.allBrands)];
      this.applyFilters();
    })

    this.cartService.currentCart$.subscribe(data => {
      this.quantities = {};
      data.forEach(item => {
        this.quantities[item?.product?.id] = item?.quantity;
      })
    })
    this.filterService?.currentFilters.subscribe(data => {
      this.filters = data;
      this.applyFilters();
    })
  }

  triggerToast(message: string) {
    this.toastService.handleSuccess(message);
  }

  open(content: any) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
  }

  addToCartHandler($event: any, product: PRODUCT) {
    $event?.stopPropagation();
    this.cartService.addToCart(product?.id, 1);
    this.toastService.handleSuccess('Item added to the cart')
  }

  increaseCartHandler(id: number) {
    this.cartService.addToCart(id, 1);
    this.toastService.handleSuccess('Item quantity updated')
  }

  decreaseCartHandler(id: number) {
    if (this.quantities?.[id] == 1) {
      let currentProduct = this.products.find(product => product?.id == id);
      if (currentProduct) this.modalService.setRemovingProduct(currentProduct);
      return;
    }
    this.cartService.addToCart(id, -1);
    this.toastService.handleSuccess('Item quantity updated')
  }

  refreshQuantity(id: number, event: any) {
    event.target.value = this.quantities?.[id];
  }

  updateCartHandler(id: number, $event: any) {
    let value = $event?.target?.value;
    if (!this.util.verifyQuantity(value)) return;

    if (value == '0') {
      let currentProduct = this.products?.find(product => product.id == id);
      if (currentProduct) this.modalService.setRemovingProduct(currentProduct);
      return;
    }
    this.cartService.updateCart(id, parseInt(value))
    this.toastService.handleSuccess('Cart items updated successfully')
  }

  removeFromCartHandler(id: number) {
    this.cartService.removeFromCart(id);
  }

  changeSorting(sort: string) {
    this.filters.sortBy = sort;
    this.applyFilters();
  }

  applySorting(sort: string) {
    this.products = [...this.productService.productsData];
    switch (sort) {
      case 'Relevance':
        this.products = this.productService.productsData
        break;
      case 'Price low to high':
        this.products = this.products?.sort((a: PRODUCT, b: PRODUCT) => a?.price - b?.price);
        break;
      case 'Price high to low':
        this.products = this.products?.sort((a: PRODUCT, b: PRODUCT) => b?.price - a?.price);
        break;
      case 'Ratings':
        this.products = this.products?.sort((a: PRODUCT, b: PRODUCT) => b?.rating - a?.rating);
        break;
    }
  }

  applyFilters() {
    this.applySorting(this.filters?.sortBy);
    this.products = this.products?.filter(product => (product?.price >= (this.filters?.minPrice || this.intMin) && product?.price <= (this.filters?.maxPrice || this.intMax)));
    if (this.filters?.rating) this.products = this.products?.filter(product => product?.rating >= (this.filters?.rating || 0))
    if (this.filters?.brands.length) this.products = this.products?.filter(product => this.filters?.brands?.includes(product?.brand));
    this.filterService.setFilters(this.filters);
  }
}
