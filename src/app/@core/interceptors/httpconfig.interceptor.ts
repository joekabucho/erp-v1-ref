import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';

@Injectable({
  providedIn: 'root',
})
export class HttpConfigInterceptor implements HttpInterceptor {


  constructor(private toastr: NbToastrService) { }



  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = localStorage.getItem('currentUserToken');

    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', `Token ${token}`) });
    }

    // if (!request.headers.has('Content-Type')) {
    //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    // }

    // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });


    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.showToast('Oops!!! something went wrong. Try refreshing the page or contact us if the problem persists', 'danger', 5000);
        }
        if (error.status === 403) {
          this.showToast(`Oops!!! You don't have the permissions to view this page. Please contact the Admin for help`, 'danger', 5000);
        }
        if (error.error.errors !== undefined) {
          const errorObject = error.error.errors;
          for (const [key, value] of Object.entries(errorObject)) {
            const errorValues = value;
            if (typeof errorValues === 'object') {
              for (const [item, pair] of Object.entries(errorValues)) {
                this.showToast(item + ' - ' + pair, 'danger', 5000);
              }
            } else {
              this.showToast(key + ' - ' + value, 'danger', 5000);
            }
          }
        }
        return throwError(error);
      }),
    );
  }

  showToast(message, status: NbComponentStatus, duration) {
    this.toastr.show(message, `Hi there!`, { status, duration });
  }
}
