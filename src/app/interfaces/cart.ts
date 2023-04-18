import { product } from "./products";
export interface cartItem {
    product: product
    quantity: number;
}

export interface itemMap {
    [id: number]: number;
} 

export interface summary {
    totalMrp: number,
    discount: number,
    deliveryCharges: number,
    amount: number,
    savings: number
  }

export interface filter {
    minPrice: number,
    maxPrice: number,
    brands:string[],
    rating: number,
    sortBy: string
}