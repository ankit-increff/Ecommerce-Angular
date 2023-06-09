import { Component, ElementRef, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { CARTITEM, SUMMARY } from 'src/app/interfaces/cart.types';
import { PRODUCT } from 'src/app/interfaces/products.types';
import { FIELDS } from 'src/app/interfaces/upload.types';
import { ProductService } from 'src/app/services/product.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  fileData: CARTITEM[] = [];
  orderItems: any = [];
  summary!: SUMMARY;
  file!: File;
  removingProduct!: PRODUCT;
  errorData:any = []
  
  @ViewChild('uploadInput') input!: ElementRef;
  @ViewChild('scrolling') scroller!: ElementRef;
  @ViewChild('modalToggleBtn') modalToggleBtnRef!: ElementRef;
  
  constructor(private papa: Papa, private productService: ProductService, private utils: UtilService, private toastService: ToastService) { }
  uploadHandler() {
    this.readFileData();
    this.input.nativeElement.value = '';
  }

  changeHandler(event: any) {
    this.file = event?.target?.files?.[0];
    this.errorData = [];
    this.orderItems = [];
    this.fileData = [];
  }

  openProduct(id: number) {
    window.open(`/#/product/${id}`, "_blank");
  }

  calculateSummary() {
    let tempSummary: SUMMARY = {
      totalMrp: 0,
      discount: 0,
      deliveryCharges: 0,
      amount: 0,
      savings: 0
    };
    this.fileData?.forEach(item => {
      let product = item?.product;
      tempSummary.amount += product?.price * item?.quantity;
      tempSummary.totalMrp += this.utils.getMrp(product?.price, product?.discount) * item?.quantity;
    });

    tempSummary.discount = tempSummary?.totalMrp - tempSummary?.amount;
    if (tempSummary.amount < 1000) {
      tempSummary.deliveryCharges = 49;
      tempSummary.amount += 49;
    }
    tempSummary.savings = tempSummary?.totalMrp - tempSummary?.amount;
    this.summary = tempSummary;
  }

  placeOrderHandler() {
    this.fileData?.forEach(item => {
      this.orderItems?.push({
        sku_id: item?.product?.id,
        title: item?.product?.title,
        price: item?.product?.price,
        quantity: item?.quantity
      })
    });
    this.utils.downloadOrder(this.orderItems);
    this.toastService.handleSuccess('Order has been placed successfully');
    this.fileData = [];
  }

  readFileData() {
    this.papa.parse(this.file, {
      header: true,
      delimiter: ",",
      skipEmptyLines: "greedy",
      complete: (result: any) => {
        this.readFileDataCallback(result);
      }
    });
  }

  readFileDataCallback(results: any) {
    let fileData = results?.data;
    let meta = results?.meta;
    if (meta?.fields?.length != 2) {
      this.toastService.handleError('No of headers do not match');
      return;
    }
    if (meta?.fields?.[0] != "sku_id" || meta?.fields?.[1] != "quantity") {
      this.toastService.handleError('Invalid header names');
      return;
    }
    const MAX_ROWS = 10
    if (results?.data?.length > MAX_ROWS) {
      this.toastService.handleError("File too big");
      return;
    }
    if(fileData?.length == 0) {
      this.toastService?.handleError("File is empty");
      return;
    }
    this.updateFileData(fileData);
  }
  updateFileData(data: Array<FIELDS>) {
    let products = this.productService?.productsData;
    let items: CARTITEM[] = [];
    let row = 1;
    for (let item of data) { 
      row++;

      if(!item.quantity) {
        this.errorData?.push({row, message: `Quantity not provided`})
        continue;
      } else {
        if(!(/^\d+$/.test((item?.quantity)?.toString()))) {
          this.errorData?.push({row, message: `Quantity is not a valid number`})          
        }
      }

      let product = products?.find(p => p?.id == parseInt(item?.sku_id));
      if (product){
        let duplicate = items?.some(p => p?.product?.id == parseInt(item?.sku_id));
        if(duplicate) {
          for(let i of items) {
            if(i?.product?.id == parseInt(item?.sku_id)) {
              i.quantity = parseInt((item?.quantity)?.toString()) + parseInt((i?.quantity)?.toString());
            }
          }
        } 
        else items?.push({ product, quantity: item?.quantity });
      } 
      else this.errorData?.push({row, message: `Product with id '${item?.sku_id}' does not exist`})
    }
    this.fileData = items;
    this.calculateSummary();
    setTimeout(() => {
      this.scroller?.nativeElement?.scrollIntoView();
    }, 1);
  }

  increaseQuantityHandler(id: number) {
    for (let i of this.fileData) {
      if (i?.product?.id == id) {
        i.quantity++;
      }
    }
    this.calculateSummary()
    this.toastService.handleSuccess('Item quantity updated')
  }

  decreaseQuantityHandler(id: number) {
    let tempItem = this.fileData?.find(item => item?.product?.id == id);
    if (tempItem && tempItem?.quantity == 1) {
      this.removingProduct = tempItem?.product;
      this.modalToggleBtnRef.nativeElement.click();
      return;
    }

    for (let i of this.fileData) {
      if (i?.product?.id == id) {
        i.quantity--;
      }
    }
    this.calculateSummary()
    this.toastService.handleSuccess('Item quantity updated')
  }

  refreshQuantity(id: number, event: any) {
    let tempItem = this.fileData?.find(item => item?.product?.id == id);
    if (tempItem) event.target.value = tempItem?.quantity;
  }

  updateQuantityHandler(id: number, event: any) {
    let value = event?.target?.value;
    if (!this.utils.verifyQuantity(value)) return;
    if (value == '0') {
      let tempItem = this.fileData?.find(item => item?.product?.id == id);
      if (tempItem) {
        this.removingProduct = tempItem?.product;
        this.modalToggleBtnRef.nativeElement.click();
        return;
      }
    }

    for (let i of this.fileData) {
      if (i?.product?.id == id) {
        i.quantity = event?.target?.value;
      }
    }
    this.calculateSummary()
    this.toastService.handleSuccess('Item quantity updated')
  }

  removeFromFileHandler() {
    this.fileData = [...this.fileData]?.filter(item => item?.product?.id != this.removingProduct?.id);
    this.calculateSummary();
    this.toastService.handleSuccess('Item removed');
  }

  removeClickHandler(id: number) {
    let tempItem = this.fileData?.find(item => item?.product?.id == id);
    if (tempItem) {
      this.removingProduct = tempItem?.product;
    }
    this.modalToggleBtnRef.nativeElement.click();
  }

  downloadAgain() {
    this.utils.downloadOrder(this.orderItems);
    this.toastService.handleSuccess('Order has been downloaded again!');
  }
}
