export interface Cart {
    message: string,
    data: CartItems[]
}

export interface CartItems {
    cart: Items;
}

export interface Items {
    id: number,
    product_name: string,
    price: number,
    files: string[],
    cart_items: ReqItem[]
}

export interface ReqItem {
    id: number,
    color: string,
    quantity: string,
    size: string
}