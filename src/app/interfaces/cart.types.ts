import { PRODUCT } from "./products.types";
export interface CARTITEM {
    product: PRODUCT
    quantity: number;
}
export interface ITEMMAP {
    [id: number]: number;
}
export interface CARTDATA {
    [email: string]: ITEMMAP
}

export interface SUMMARY {
    totalMrp: number,
    discount: number,
    deliveryCharges: number,
    amount: number,
    savings: number
}

export interface FILTER {
    minPrice: number,
    maxPrice: number,
    brands: string[],
    rating: number,
    sortBy: string
}