import { Injectable } from '@angular/core';
import { FILTER } from '../interfaces/cart.types';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  isPriceFilterInvalid: Boolean = false;
  currentFilters = new BehaviorSubject<FILTER>({
    minPrice: -1,
    maxPrice: 1e9+7,
    brands:[] as string[],
    rating: 0,
    sortBy: 'Relevance'
  });
  
  constructor(private toastService:ToastService) { }

  setCurrentFilters(filter:FILTER) {
    this.currentFilters.next(filter);
  }

  setFilters(filters:FILTER) {
    sessionStorage.setItem('filters', JSON.stringify(filters));
  }

  getAllFilters():FILTER {
    const filtersJson = sessionStorage.getItem('filters');
    let appliedFilters = {
      minPrice: -1,
      maxPrice: 1e9+7,
      brands:[] as string[],
      rating: 0,
      sortBy: 'Relevance'
    }
    if(filtersJson) {
      if(this.verifyFilters(filtersJson)) appliedFilters = JSON.parse(filtersJson);
    }
    this.setCurrentFilters(appliedFilters);
    return appliedFilters;
  }

  verifyFilters(json:any) {
    try {
      let filters = JSON.parse(json);
      if(!filters.hasOwnProperty('minPrice') || !filters.hasOwnProperty('maxPrice') || !filters.hasOwnProperty('brands') || !filters.hasOwnProperty('rating') || !filters.hasOwnProperty('sortBy') || Object.keys(filters)?.length>5) {
        throw new Error("Unhandled exception: Session storage has been tampered!!");
      }
    } catch (error) {
      this.toastService.handleError("Unhandled exception: Session storage has been tampered!!");
      return false;
    } 
    return true;
  }

  clearFilters() {
    sessionStorage.removeItem('filters');
  }
}
