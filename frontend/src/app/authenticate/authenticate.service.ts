import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";



@Injectable({
  providedIn:'root'
})
export class AuthenticateService{
  ROOT_URL: string = environment.APP_URL
  // tokenSubject$ = new BehaviorSubject(null);
  //token
  userBody

  constructor(private http:HttpClient){ }

  login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/api/users/login`, { email, password }, {
        observe:'response'
    }).pipe(tap((res: HttpResponse<any>) => {
        console.log(res)
        // this.token = res.body.token

        this.setSession(res.body.token, res.body)
        // this.tokenSubject$.next(res.body.token)
        this.userBody = res.body
      }))
  }
  isLoggedIn() {
    return !!localStorage.getItem('token')
  }
  getToken() {
     return localStorage.getItem('token')
    // return this.token
  }
//   public get currentAuthTokenValue() {
//     return this.tokenSubject$.value;
// }

  setSession( token:string, body:object) {
    //localStorage.setItem('userId', id)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(body))
  }
  logout() {
    this.removeSession()

  }
  removeSession() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }
}
