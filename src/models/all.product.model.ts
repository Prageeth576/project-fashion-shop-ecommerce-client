export interface AllProduct {
    message: string,
    data: SubProducts[]
}

export interface SubProducts {
    products: Products[]
}

export interface Products {
    id: number,
    product_name: string,
    price: number,
    size: Sizes[],
    specification: string,
    colors: string,
    availability: string,
    files: string[],
    subs: Category[],  
}

export interface Sizes {
    code: string,
    name: string
}

export interface Category {
    category_name: string
}

export interface SelectProduct {
    id: number,
    product_name: string,
    price: number,
    sizes: Sizes[],
    specifications: string,
    colors: Colors[],
    availability: string,
    files: Images[],
    subs: Category[],  
}

export interface Images {

}

export interface Colors {
    id: number,
    color_name: string
}
