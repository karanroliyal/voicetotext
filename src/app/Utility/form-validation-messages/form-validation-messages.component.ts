import { NgIf } from '@angular/common';
import { Component,Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  imports:[NgIf],
  selector: 'app-form-validation-messages',
  templateUrl: './form-validation-messages.component.html',
  styleUrls: ['./form-validation-messages.component.css']
})
export class FormValidationMessagesComponent {
  @Input() control: FormControl | any;
  @Input() name:any
  @Input() minlength:any
  @Input() maxlength:any
  @Input() invalidEmail:boolean = false
}
