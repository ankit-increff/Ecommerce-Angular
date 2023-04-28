import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { UploadComponent } from './components/upload/upload.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { FilterComponent } from './components/filter/filter.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    ToastComponent,
    ConfirmationModalComponent,
    NavbarComponent,
    FooterComponent,
    AppComponent,
    ProductsComponent,
    FilterComponent,
    LoginComponent,
    CartComponent,
    UploadComponent,
    ProductDetailComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
