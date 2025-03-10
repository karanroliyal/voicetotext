import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GlobalRoutingService } from '../global-services/global-routing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private globalService: GlobalRoutingService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.globalService.getFromLocalStorage('token');
    if (token) {
      // If user is logged in and tries to access login page, redirect to dashboard
      if (window.location.pathname === '/log-In') {
        this.router.navigate(['layout/home']);
        return false;
      }
      return true;
    } else {
      // If user is not logged in and tries to access protected routes, redirect to login
      if (window.location.pathname !== '/log-In') {
        this.router.navigate(['/log-In']);
        return false;
      }
      return true;
    }
  }
} 