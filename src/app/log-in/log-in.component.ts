import { Component } from '@angular/core';
import { CommonHtmlModule } from '../Utility/common-html/common-html.module';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormValidationMessagesComponent } from '../Utility/form-validation-messages/form-validation-messages.component';
import { globalServicesDecorator } from '../Services/global-services.decorator';
import { json } from 'express';

@Component({
  selector: 'app-log-in',
  imports: [CommonHtmlModule, FormValidationMessagesComponent, ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css',
})

export class LogInComponent {
  logInForm: FormGroup;
  isLoading: boolean = false;
  
  constructor(private router: Router, private GSD: globalServicesDecorator) {
    this.logInForm = new FormGroup({
      user_email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(8)]),
      action: new FormControl('logIn'),
      table_name: new FormControl('user_master')
    });
  }

  Log_In() {
    if(this.logInForm.valid) {
      this.isLoading = true;
      const formdata = this.GSD.globalFunction.convertToFormdata(this.logInForm);
      
      this.GSD.globalRouting.api('login', 'login_verification', formdata,
        (res: any) => {
          this.isLoading = false;
          if (res.statusCode == 200) {
            this.GSD.globalRouting.setAuthData(res.data, 'token');
            this.router.navigate(['/layout/home']);
            setTimeout(()=>{
              this.get_menu();
            },20)
          } else {
            this.GSD.global.toast(res.message, 'danger');
          }
        });
    } else {
      this.logInForm.markAllAsTouched();
    }
  }


  get_menu(){

    const formdata = new FormData();

    formdata.append('action' , 'get menu');
    formdata.append('table_name' , 'menu_master');

    this.GSD.globalRouting.api('menu', 'get_menu', formdata,
      (res: any) => {

        localStorage.setItem('menu' , JSON.stringify(res.data))

      }
    )

  }


}
