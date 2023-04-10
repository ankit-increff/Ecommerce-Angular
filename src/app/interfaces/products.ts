export interface product {
    id: string;
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

export interface productJson {
    products: product[];
}

