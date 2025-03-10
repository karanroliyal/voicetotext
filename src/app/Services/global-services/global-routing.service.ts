import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environment/environment'
import { Router } from '@angular/router';
// import { jwtDecode } from 'jwt-decode';
// import * as CryptoJS from 'crypto-js';
// const baseUrl = environment.base_url;
const serverURL = environment.server_url;

@Injectable({
  providedIn: 'root',
})
export class GlobalRoutingService {
  constructor(private http: HttpClient, public router: Router) {}

  clearStorangeData() {
    localStorage.clear();
    sessionStorage.clear();
  }

  setAuthData(data: any, key: string = 'token') {
    this.setIntoLocalStorage(key, data);
  }

  setIntoLocalStorage(key: string, data: string) {
    localStorage.setItem(key, data);
  }

  getFromLocalStorage(key: string) {
    return localStorage.getItem(key);
  }

  // decodeToken(): any {
  //   try {
  //     let token: any = localStorage.getItem('token');
  //     return jwtDecode(token);
  //   } catch (error) {
  //     console.error('Error decoding JWT token:', error);
  //     return null;
  //   }
  // }

  // private encryptionKey = 'kiShAn22()3';

  // encrypt(data: any): string {
  //   const encryptedData = CryptoJS.AES.encrypt(
  //     JSON.stringify(data),
  //     this.encryptionKey
  //   ).toString();
  //   return encryptedData;
  // }

  // decrypt(encryptedData: string): any {
  //   const decryptedBytes = CryptoJS.AES.decrypt(
  //     encryptedData,
  //     this.encryptionKey
  //   );
  //   const decryptedData = JSON.parse(
  //     decryptedBytes.toString(CryptoJS.enc.Utf8)
  //   );
  //   return decryptedData;
  // }

  api(controllerName: any, method: any, data: any = {}, callback: Function) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };
    
    // Add token to headers if available
    const token = this.getFromLocalStorage('token');
    if (token) {
      httpOptions.headers = httpOptions.headers.set('Authorization', 'Bearer ' + token);
    }
    
    var response = this.http.post(serverURL + controllerName + '/' + method, data, httpOptions);
    response.subscribe({
      next: (res: any) => {
        if (res.statusCode == 401) {
          this.clearStorangeData();
          this.router.navigate(['log-In']);
        } else {
          callback(res);
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.clearStorangeData();
          this.router.navigate(['log-In']);
        }
        callback({ statusCode: 500, message: error.message || 'Server error' });
      }
    });
  }

  permissions: any = {};
  checkPermissions(module: any, callback: any = '') {
    let $this = this;
    this.permissions = {
      'VIEW_RIGHT': 0,
      'ADD_RIGHT': 0,
      'EDIT_RIGHT': 0,
      'DELETE_RIGHT': 0,
    };
    
    this.api('user_rights', 'get_user_rights', { 'module': module }, function (res: any) {
      if (res.statusCode == 200) {
        $this.permissions = res.data;
      }
      if (callback) {
        callback();
      }
    });
  }
}
