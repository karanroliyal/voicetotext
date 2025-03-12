import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

export function httpInterceptorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  

  const router = inject(Router);


  if(router.url.split('/')[1] != 'log-In'){

    const authToken = localStorage.getItem('token');
  
    const newReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      .set('myurl' , router.url.split('/')[2] )
    });
    
    return next(newReq);

  }else{
    
    const newReq = req.clone({
      headers: req.headers.set('Authorization', 'login')
    });
    
    return next(newReq);

  }

  
}
