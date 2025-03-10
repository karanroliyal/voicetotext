import { Injectable, HostListener, OnInit } from '@angular/core';
import {
  FormControl,
  FormControlName,
  Validators,
  FormBuilder,
  FormGroup,
  FormArray, AbstractControl
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class GlobalValidationService {
  showPassword: any;
  
  numberOnly(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  showHidePass() {
    this.showPassword = !this.showPassword;
  }

  numberWithDash(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || charCode === 45) {
      return true;
    }
    return false;
  }

  numberWithDecimal(event: { which: any; keyCode: any }): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (
      (charCode >= 48 && charCode <= 57) ||
      charCode === 46 ||
      charCode === 45
    ) {
      return true;
    }

    return false;
  }

  getNgClass(formControlName: string,formGroup: any): { [key: string]: boolean } {
    const control = formGroup.get(formControlName);
    return {
      'is-invalid': control ? control.invalid && control.touched : false,
      'is-valid': control ? control.valid && control.touched : false,
    };
  }

  handleNumericValidation(formControlName: any, controlName: string) {
    const control = formControlName.get(controlName);
    if (!control) return;
    let value = parseFloat(control.value);
    if (isNaN(value)) {
      value = 0;
    }
    control.setValue(value.toFixed(2), { emitEvent: false });
  }

  getCurrentDate(): string {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }
}
