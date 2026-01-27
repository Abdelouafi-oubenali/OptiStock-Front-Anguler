import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded.role;

      const allowedRoles = route.data['roles'] as string[] || [];

      if (allowedRoles.length === 0 || allowedRoles.includes(role)) {
        return true;
      }

      this.router.navigate(['/forbidden']);
      return false;

    } catch (e) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
