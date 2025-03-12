import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { globalServicesDecorator } from '../../Services/global-services.decorator';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidationMessagesComponent } from "../../Utility/form-validation-messages/form-validation-messages.component";

interface language {
  id: string,
  language_name: string
}
interface gender {
  value: string,
  gender: string
}
interface voice {
  id: string,
  voice_name: string
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormValidationMessagesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  

  languageList: language[] = [{ id: '', language_name: 'No language available' }] ;
  genderList: gender[] | any ;
  voiceList: voice[] = [{ id: '', voice_name: 'Please select language and gender' }] ;

  constructor(private GSD: globalServicesDecorator) { }

  ngOnInit(): void {

    this.getLanguage();

  }

  voiceForm = new FormGroup({
    voice_name : new FormControl('' , [Validators.required]),
    voice_gender : new FormControl('', [Validators.required]),
    language_name : new FormControl('', [Validators.required]),
    message : new FormControl('', [Validators.required]),
  })

  convertMessage(){

    this.voiceForm.markAllAsTouched();

  }

  getLanguage() {

    const formData = new FormData();
    formData.append('action', 'get list');
    formData.append('table_name', 'language_master');
    formData.append('fields', 'id,language_name');

    this.GSD.globalRouting.api('dropdown', 'get_dropdown', formData, (res: any) => {

      if (res.statusCode == 200) {
        this.languageList = res.data;
      } else {
        this.GSD.global.toast(res.message, 'danger')
      }

    })

  }

  resetForm(){
    setTimeout(()=>{
      this.voiceList = [{id:'' , voice_name:'Please select language and gender'}];
      this.genderList = [];
    },200)
  }

  setGender(languageValue: string) {
    if (languageValue != '0') {
      this.genderList=[];
      this.genderList = [
        { value: 'Male', gender: 'Male' }, { value: 'Female', gender: 'Female' }
      ]
    } else {
      this.genderList = [
        { value: '', gender: 'Please select language' }
      ]
    }
  }

  setVoice(genderValue: string, languageValue: string) {
    if (genderValue != '0' && languageValue != '0') {

      const formData = new FormData();

      formData.append('action', 'get list');
      formData.append('table_name', 'language_master');
      formData.append('fields', 'id , voice_name');
      formData.append('where', 'language_name,voice_gender')
      formData.append('where_value', `${languageValue} , ${genderValue}`)

      this.GSD.globalRouting.api('dropdown', 'get_dropdown', formData, (res: any) => {

        if (res.statusCode == 200) {
          this.voiceList = res.data;
        } else {
          this.GSD.global.toast(res.message, 'danger')
        }
      })

    } else {
      this.voiceList = [{ id: '', voice_name: 'Please select language and gender' }];
      this.voiceList = [{id:'' , voice_name:'Please select language and gender'}];
      this.genderList = [];
    }
  }



}