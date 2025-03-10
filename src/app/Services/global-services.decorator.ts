import { Injectable } from '@angular/core';
import { GlobalService } from './global-services/global.service';
import { GlobalValidationService } from './global-services/global-validation.service';
import { GlobalFunctionService } from './global-services/global-function.service';
import { GlobalRoutingService } from './global-services/global-routing.service';



@Injectable({
  providedIn: 'root'  // Ensures it's globally available
})
export class globalServicesDecorator {
  constructor(
    public global: GlobalService,
    public globalRouting: GlobalRoutingService,
    public globalValidation: GlobalValidationService,
    public globalFunction: GlobalFunctionService,
  ) {}
}
