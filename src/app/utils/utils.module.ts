import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card/product-card.component';



@NgModule({
  declarations: [
    ProductCardComponent
  ],
  imports: [
    CommonModule //ON TOP OF APP MODULE
  ],
  exports: [
    ProductCardComponent
  ]
})
export class UtilsModule { }
