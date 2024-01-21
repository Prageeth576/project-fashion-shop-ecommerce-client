export interface Category {
    message: string,
    data: AllCategories[]
}

export interface AllCategories {
    category_name: string,
    id: number,
    subs: SubCategory[]
}

export interface SubCategory {
    id: number,
    sub_category_name: string
}

export class Sub {
    constructor(
        public subid: string 
    ) {}
}