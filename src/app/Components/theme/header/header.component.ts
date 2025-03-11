import { Component } from '@angular/core';
import { globalServicesDecorator } from '../../../Services/global-services.decorator';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user_name : string = '';

  constructor(private GSD: globalServicesDecorator ) {

    this.user_name = this.GSD.globalRouting.decodeToken().data.user_name;

  }

  


}
