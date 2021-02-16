import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { AuthenticateService } from "./authenticate.service";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticateService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = this.authService.getToken()
    if (!token) {
      return next.handle(request)
    }
    const req1 = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    })
    return next.handle(req1)


  }

}

// JWT interceptor
// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { Observable } from 'rxjs';


// import { AuthenticateService } from './authenticate.service';


// @Injectable()
// export class AuthServiceInterceptor implements HttpInterceptor {
//   constructor(private authService:AuthenticateService) { }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // add authorization header with jwt token if available
//     const currentAuthToken = this.authService.currentAuthTokenValue;
//     if (currentAuthToken && currentAuthToken.token) {
//       const headers = {
//         'Authorization': `Bearer ${currentAuthToken.token}`,
//       };
//       if (request.responseType === 'json') {
//         headers['Content-Type'] = 'application/json';
//       }
//       request = request.clone({
//         setHeaders: headers
//       });
//     }

//     return next.handle(request);
//   }
// }





// }
// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
// import { Observable } from 'rxjs';

// import { AuthenticationService } from '../services/authentication.service';


// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//     constructor(private authenticationService: AuthenticationService) {}

//     intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         // add authorization header with jwt token if available
//         const currentAuthToken = this.authenticationService.currentAuthTokenValue;
//         if (currentAuthToken && currentAuthToken.token) {
//             const headers = {
//                 'Authorization': `Bearer ${currentAuthToken.token}`,
//             };
//             if (request.responseType === 'json') {
//                 headers['Content-Type'] = 'application/json';
//             }
//             request = request.clone({
//                 setHeaders: headers
//             });
//         }

//         return next.handle(request);
//     }
