import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../../environment/environment'
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
// import * as CryptoJS from 'crypto-js';
// const baseUrl = environment.base_url;
const serverURL = environment.server_url;

@Injectable({
  providedIn: 'root',
})
export class GlobalRoutingService {
  constructor(private http: HttpClient, public router: Router, public currentRoute: ActivatedRoute) { }

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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Function to decode JWT token
  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token); // Decode and return payload
      } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
      }
    }
    return null;
  }


  api(controllerName: any, method: any, data: any = {}, callback: Function) {

    var response = this.http.post(serverURL + controllerName + '/' + method, data);
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
  checkPermissions(table_name: string, callback: any = '') {
    let $this = this;
    this.permissions = {
      'add_rights': 0,
      'view_rights': 0,
      'update_rights': 0,
      'delete_rights': 0,
    };

    let formData = new FormData();

    formData.append('table_name', table_name)
    formData.append('action', 'get rights')

    this.api('crud', 'get_user_rights', formData, function (res: any) {
      if (res.statusCode == 200) {
        $this.permissions = res.data;
      }
      if (callback) {
        callback();
      }
    });
    // return this.permissions;
  }
}






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
