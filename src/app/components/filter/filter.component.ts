import { Component, Input } from '@angular/core';
import { FILTER } from 'src/app/interfaces/cart.types';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  priceFilterErrorMessage = '';
  filters: FILTER = {
    minPrice: -1,
    maxPrice: 1e9 + 7,
    brands: [] as string[],
    rating: 0,
    sortBy: 'Relevance'
  }

  @Input() allBrands!: string[]
  @Input() intMin!:number;
  @Input() intMax!:number;

  constructor(private filterService: FilterService) {}

  ngOnInit() {
    let filters = this.filterService.getAllFilters();
    this.filters = filters;
  }

  changeMinPriceHandler(event: any) {
    this.filters.minPrice = event?.target?.value;
    this.priceFilterErrorCheck();
    this.filterService.setCurrentFilters(this.filters);
  }
  
  changeMaxPriceHandler(event: any) {
    this.filters.maxPrice = event?.target?.value;
    this.priceFilterErrorCheck();
    this.filterService.setCurrentFilters(this.filters);
  }

  ratingChangeHandler(event: any) {
    this.filters.rating = parseInt(event?.target?.value)
    this.filterService.setCurrentFilters(this.filters);
  }

  brandChangeHandler(event: any) {
    if (event.target.checked) this.filters?.brands?.push(event?.target?.value);
    else this.filters.brands = [...this.filters.brands].filter(brand => brand != event?.target?.value);
    this.filterService.setCurrentFilters(this.filters);
  }

  clearFilters() {
    this.filterService.clearFilters();
    this.filters = this.filterService.getAllFilters();
    this.filterService.setCurrentFilters(this.filters);
  }

  priceFilterErrorCheck() {
    let mx = this.filters?.maxPrice,
      mn = this.filters?.minPrice;

    if (mx && mx != this.intMax && !(/^\d+$/.test(mx.toString()))) {
      this.priceFilterErrorMessage = "Max Price must be a positive integer"
      this.filterService.isPriceFilterInvalid = true;
      return true;
    }
    if (mn && mn != this.intMin && !(/^\d+$/.test(mn.toString()))) {
      this.priceFilterErrorMessage = "Min Price must be a positive integer"
      this.filterService.isPriceFilterInvalid = true;
      return true;
    }
    if (mx && mn && mx - mn < 0) {
      this.priceFilterErrorMessage = "Min Price should not be greater than max price"
      this.filterService.isPriceFilterInvalid = true;
      return true; 
    }
    this.filterService.isPriceFilterInvalid = false;
    return false;
  }
}
