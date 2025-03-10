import { Component, inject, Injectable, Input, input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-paggination',
  imports: [],
  templateUrl: './paggination.component.html',
  styleUrl: './paggination.component.css'
})


export class PagginationComponent {

  constructor() {
  }

  formdata = input<FormGroup>();
  page_no = input<number>(0);
  total_records = input<number>(0);
  @Input()
  public callback: Function | undefined;
  getRows(row: any) 
  {
    this.formdata()?.controls['row_no'].setValue(row);
    this.formdata()?.controls['limit'].setValue(row);
    this.formdata()?.controls['current_page'].setValue(1);
    if (this.callback) {
      this.callback();
    }
  }


  left() {
    if (this.page_no() > 1) {
      this.formdata()?.controls['current_page'].setValue(this.page_no() - 1);
      if (this.callback) {
        this.callback();

      }

    }
  }



  right() {
    if (this.total_records() > this.page_no()) {
      this.formdata()?.controls['current_page'].setValue(this.page_no() + 1);
      if (this.callback) {
        this.callback();
      }
    }
  }


  first(){
    this.formdata()?.controls['current_page'].setValue(1);
    if (this.callback) {
      this.callback();
    }
  }

  last(){
    this.formdata()?.controls['current_page'].setValue(this.total_records());
    if (this.callback) {
      this.callback();
    }
  }


}
