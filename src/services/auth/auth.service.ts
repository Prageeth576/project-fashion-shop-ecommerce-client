import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Auth } from '../../models/auth.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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


  // sign up
  signUp(auth: Auth): Observable<Auth> {
    return this.http.post<Auth>(this.baseUrl + 'auth/register', auth, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  // login
  login(auth: Auth): Observable<Auth> {
    return this.http.post<Auth>(this.baseUrl + 'auth/signin', auth, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  // log out
  logOut(): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'auth/signout', {}, httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }
}
