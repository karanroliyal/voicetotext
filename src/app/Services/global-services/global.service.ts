import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalRoutingService } from './global-routing.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(
    private router: Router,
    private globalRouting: GlobalRoutingService
  ) {}

  alertBox: boolean = false;
  alertContent: any;
  alertType: any = '';
  private toastTimeout: any;

  toast($msg: any, $type = 'success') {
    if ($msg != '') {
      // Clear any existing timeout
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }

      this.alertBox = true;
      this.alertContent = $msg;
      this.alertType = $type;

      // Auto hide after 3 seconds
      this.toastTimeout = setTimeout(() => {
        this.alertBox = false;
        this.alertContent = '';
        this.alertType = '';
      }, 3000);
    } else {
      this.alertBox = false;
      this.alertContent = '';
      this.alertType = '';
    }
  }

  toggleSidemenu: boolean = true;
  arrowIcon: any = 'bi bi-list';
  companyLogo: any = 'assets/images/software-icon/icon.png';
  imageSize: any = '50%';
  imageHeight: any = '';

  toggleSidebar() {
    const sidebar = document.querySelector('#sidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed');
    }
  }

  logout(local_permission: any) {
    if (local_permission == 'clear') {
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['log-In']);
    }
  }

  masterList(data:{},controllerName:string,functionName:string){
    return new Promise((resolve, reject) => {
      this.globalRouting.api(controllerName,functionName, data, (res: any) => {
        if (res.statusCode != 200) {
          reject(res);
        } else {
          resolve(res);
        }
      });
    });
  }

  masterDelete(data:{},controllerName:string){
    return new Promise((resolve,reject) => {
      this.globalRouting.api(controllerName,'masterDelete',data,(res:any) => {
        if (res.statusCode != 200) {
          reject(res);
        } else {
          resolve(res);
        }
      })
    })
  }

}
