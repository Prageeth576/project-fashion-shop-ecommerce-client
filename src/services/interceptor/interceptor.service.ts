import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable()

export class InterceptorService implements HttpInterceptor {

  constructor(
    private storageService: StorageService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let authReq = req
    const authToken = this.storageService.getToken()

    if (authToken != null) {
      authReq = req.clone({
        headers: req.headers.set('authorization', authToken)
      })
    }

    return next.handle(authReq)
  }
}
