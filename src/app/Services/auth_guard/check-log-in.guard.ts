import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class checkLogInGuard implements CanActivate {
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      // If user is already logged in, redirect to home page
      this.router.navigate(['layout/home']); 
      return false;
    }
    return true; 
  }
}
