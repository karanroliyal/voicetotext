import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionService {

  constructor() { }

  // checks for required field in formGroup
  public hasRequiredValidator(control: FormControl): boolean {
    return !!control.validator && control.hasValidator(Validators.required);
  }

  
  deleteRow(formArray: FormArray, index: number) {
    if (formArray.length > 1) {
      formArray.removeAt(index);
    }
  }

  convertToFormdata(data: FormGroup | Record<string, any>): FormData {
    const formData = new FormData();
    const values = data instanceof FormGroup ? data.value : data;
    
    if (!values) {
      console.error('Invalid data passed to convertToFormdata');
      return formData;
    }

    Object.entries(values).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        formData.append(key, '');
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    return formData;
  }

}
