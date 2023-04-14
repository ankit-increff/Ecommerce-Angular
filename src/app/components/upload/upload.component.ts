import { Component } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { cartItem, itemMap } from 'src/app/interfaces/cart';
import { ProductService } from 'src/app/services/product.service';

interface fields {
  sku_id: string;
  quantity: number;
}
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  constructor(private papa: Papa, private productService:ProductService) { }

  fileData:cartItem[] = [];

  uploadHandler(input: File) {
    console.log(input);
  }
  submitHandler(input: File) {
    console.log(input);
  }

  previewHandler(input: File) {
    console.log(input);
  }
  changeHandler(event: any) {
    this.readFileData(event.target.files[0]);
  }

  openProduct(id:number){
    window.open(`/#/product/${id}`, "_blank");
}

  readFileData(file: File) {
    console.log(file);
    this.papa.parse(file, {
      header: true,
      delimiter: ",",
      skipEmptyLines: "greedy",
      complete: (result: any) => {
        console.log(result);
        this.readFileDataCallback(result);
      }
    });
  }

  readFileDataCallback(results: any) {
    let fileData = results.data;
    let meta = results.meta;
    if (meta.fields.length != 2) {
      console.error('no of headers do not match')
    }
    if(meta.fields[0]!="sku_id" || meta.fields[1]!="quantity") {
        console.error('invalid header names')
    }
    const MAX_ROWS = 10
    if(results.data.length>MAX_ROWS) {
        console.error("File too big!");
    }
    this.updateFileData(fileData);
  }

  updateFileData(data: Array<fields>) {
    console.log(data);
    let products = this.productService.productsData;
    let items:cartItem[] = [];
    for(let item of data) {
      let product = products.find(p => p.id == parseInt(item.sku_id));
      if(product) items.push({ product, quantity: item.quantity });
    }
    this.fileData = items;
    console.log(this.fileData);
  }

  increaseQuantityHandler(id:number) {
    for(let i of this.fileData) {
      if(i.product.id == id) {
        i.quantity++;
      }
    }
  }

  decreaseQuantityHandler(id:number) {
    for(let i of this.fileData) {
      if(i.product.id == id) {
        i.quantity++;
      }
    }
  }

  updateQuantityHandler(id:number, event:any) {
    for(let i of this.fileData) {
      if(i.product.id == id) {
        i.quantity = event.target.value;
      }
    }
  }

  removeItemHandler(id:number) {
    let newFileData = this.fileData.filter(item => item.product.id != id)
    this.fileData = newFileData;
  } 
}
