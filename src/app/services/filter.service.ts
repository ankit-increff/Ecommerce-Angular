import { Injectable } from '@angular/core';
import { filter } from '../interfaces/Cart.types';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  setFilters(filters:filter) {
    sessionStorage.setItem('filters', JSON.stringify(filters));
  }

  getAllFilters():filter {
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
    return appliedFilters;
  }

  verifyFilters(json:any) {
    try {
      let filters = JSON.parse(json);
      if(!filters.hasOwnProperty('minPrice') || !filters.hasOwnProperty('maxPrice') || !filters.hasOwnProperty('brands') || !filters.hasOwnProperty('rating') || !filters.hasOwnProperty('sortBy') || Object.keys(filters).length>5) {
        throw new Error("Unhandled exception: Session storage has been tampered!!");
      }
    } catch (error) {
      /// handle error
      alert("Unhandled exception: Session storage has been tampered!!");
      return false;
    } 
    return true;
  }

  clearFilters() {
    sessionStorage.removeItem('filters');
  }
}
