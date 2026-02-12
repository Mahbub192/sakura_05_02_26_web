import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authService.currentUserValue;

    if (currentUser) {
      // Check if route has role requirement
      const requiredRole = route.data['role'];
      if (requiredRole && currentUser.role !== requiredRole) {
        // Role not authorized, redirect to appropriate dashboard
        this.router.navigate([`/${currentUser.role}/dashboard`]);
        return false;
      }
      // Authorized
      return true;
    }

    // Not logged in, redirect to login page
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}


