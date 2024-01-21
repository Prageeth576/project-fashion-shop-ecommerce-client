import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

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


  // add to cart
  addToCart(
    product_id: any,
    user_id: any,
    quantity: any,
    color: any,
    size: any
  ): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'user/add-to-cart', {
      product_id,
      user_id,
      quantity,
      color,
      size
    }, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  // get cart details
  getCartDetails(id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + `user/get-cart-items/${id}`)
      .pipe(
        catchError(this.handleError)
      )
  }

  // delete cart
  deleteCart(product_id: any, user_id: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'user/delete-cart', { product_id, user_id }, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  // get order details
  orderDetails(session_id: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + `checkout/order/success?session_id=${session_id}`)
      .pipe(
        catchError(this.handleError)
      )
  }
}
