import { Injectable, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpEvent,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
// import { IContainer } from '../models/api-container.model';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    @Inject("BASE_API_URL") private baseUrl: string,
    @Inject("Test_API_URL") private testUrl: string,
      ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // request = request.clone({
    //   headers: request.headers.set('Authorization', 'Bearer ' + token)
    // });
    let checkUrl = request.url.split('/');
    if (localStorage.getItem('isLoggedin')) {
      request = request.clone({
        url: `${
            this.baseUrl
        }${request.url}`
      });
      request = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + localStorage.getItem('isLoggedin')
        )
      });
    } else {
        request = request.clone({ url: `${this.baseUrl}${request.url}` });
    }

    request = request.clone({
      headers: request.headers.set('Content-Type', 'application/json')
    });
    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    // Use for middleware
    return next.handle(request).pipe(
      retry(0),
      catchError((error: HttpErrorResponse) => {
      return throwError(error);
      })
    );
  }
}