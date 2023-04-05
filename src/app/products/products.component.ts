import { Component } from '@angular/core';
import {NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  closeResult = '';

	constructor(private offcanvasService: NgbOffcanvas) {}

	open(content:any) {
		this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' });
	}

  sort= 'Relevance';

  data:any;
  repeat = Array(40).fill(0);
}
