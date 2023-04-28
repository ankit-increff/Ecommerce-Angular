export interface PRODUCT {
    id: number;
    title: string;
    description: string;
    price: number;
    discount: number;
    rating: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: Array<string>;
}

export interface PRODUCTJSON {
    products: PRODUCT[];
}

export interface QUANTITYARRAY {
    [id: number]: number;
}

export interface MODALPRODUCT {
    id: number;
    title: string;
}

