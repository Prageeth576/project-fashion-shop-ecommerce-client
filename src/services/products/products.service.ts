import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Category } from '../../models/categories.model';
import { AllProduct } from '../../models/all.product.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private baseUrl = 'http://localhost:8080/api/'

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.log('An error occurred:', error.error)
    } else {
      console.error(`Server returned code ${error.status}, body was: `, error.error)
    }

    return throwError(() => new Error(`Server returned code ${error.status}, body was: ${error.error.message}`))
  }

  // get all product categories
  allProductMainCategories(): Observable<Category> {
    return this.http.get<Category>(this.baseUrl + 'web-products/all-main-categories') 
    .pipe(
      catchError(this.handleError)
    )
  }

  // get selected sub categories
  getSubCategories(category_name: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + `web-products/sub-product-categories/${category_name}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  // get selected sub category products
  getSubProduct(id: any): Observable<AllProduct> {
    return this.http.get<AllProduct>(this.baseUrl + `web-products/sub-products/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }

  // get selected product
  getSelectProduct(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + `web-products/select-product/${id}`)
    .pipe(
      catchError(this.handleError)
    )
  }
}
