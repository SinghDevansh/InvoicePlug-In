import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthenticateService } from './authenticate.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticateService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) {
    // this.router.navigate(['/login'])

      //this.authService.logout()
      return true;
    } else {
      this.router.navigate(['/login'])
      this.authService.logout()
      return false
    }
  }
}
@Injectable({
  providedIn:'root'
})
export class AuthGuard2 implements CanActivate {

  constructor(private router: Router, private authService: AuthenticateService, private route:ActivatedRoute) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //console.log(this.authService.isLoggedIn())
    if (localStorage.getItem('user')) {
      this.router.navigate(['/home'])

      //this.authService.logout()
      return false;
    } else {
      // this.router.navigate(['/login'])
      // this.authService.logout()
      return true
    }
  }
}
@Injectable({ providedIn: 'root' })
export class AuthGuard3 implements CanActivate {
constructor( private router: Router,
private route : ActivatedRoute) {}


canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
const userData = JSON.parse(localStorage.getItem("user"))
if(userData.isSuperAdmin){
  return true;
}
this.router.navigate(['/home'],{relativeTo:this.route})
return false;
}
}
// { queryParams: { returnUrl: state.url }}
