import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  // declarations: [FormValidationMessagesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

   
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    
  ],
 
})
export class CommonHtmlModule { }
