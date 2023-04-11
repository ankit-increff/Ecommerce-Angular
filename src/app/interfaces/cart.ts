import { product } from "./products";
export interface cartItem {
    product: product
    quantity: number;
}

export interface itemMap {
    [id: string]: number;
} 