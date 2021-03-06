import { HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { catchError, Observable, of, throwError,retry } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  router: any;
  constructor(private errorService: ErrorHandlerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(1),
      catchError((error:HttpErrorResponse) => {
        let errorMessage = '';
        let errorMsg = '';
        if(error.error instanceof ErrorEvent){
          //client-side error
          errorMessage = `Error: ${error.error.message}`;
          errorMsg = error.error.message; 
        } else {
          //server-side error
          errorMessage =`Error status: ${error.status}\nMessage: ${error.message}`;
          errorMsg =error.message; 
        }
        this.errorService.errorMessage$.next(errorMsg);
        return throwError(() => new Error(errorMessage));
      })
    )

  }
}
