import { Component, OnInit, HostListener } from '@angular/core';
import { globalServicesDecorator } from '../../../Services/global-services.decorator';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,NgClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  menu:[]=[];
  parents_menu:any=[];
  isMobileOpen: boolean = false;

  constructor(public GSD:globalServicesDecorator){
    this.loadMenu();
  }

  ngOnInit(): void {
    
  }

  menu_array  = [
    {"id":"1","menu_name":"Home","icon":'bi bi-house-add-fill',"priority":"1","menu_url":'home',"parent_id":"0","type":"1"},
    {"id":"2","menu_name":"User master","icon":'bi bi-person-add',"priority":"1","menu_url":'user_master',"parent_id":"5","type":"1"},
    {"id":"5","menu_name":"Masters","icon":null,"priority":"2","menu_url":'',"parent_id":"0","type":"0"},
    {"id":"3","menu_name":"Language master","icon":'bi bi-translate',"priority":"2","menu_url":'language_master',"parent_id":"5","type":"1"},
    {"id":"4","menu_name":"User permission","icon":'bi bi-person-lock',"priority":"3","menu_url":'user_permission',"parent_id":"5","type":"1"}
  ]

  get_menu(){
    const menudata= new FormData();
    menudata.append('action','get menu');
    menudata.append('table_name','menu_master');
    this.GSD.globalRouting.api('menu','get_menu',menudata,(res:any)=>{
      if(res.status==true){
        this.menu=res;
      }
      else{
        this.GSD.global.toast(res.message, 'danger');
      }
    })
  }
  
  loadMenu(){
    this.parents_menu = this.menu_array
      .filter((ele) => ele.parent_id === "0")
      .map((parent) => ({
        ...parent,
        children: this.menu_array.filter((child) => child.parent_id === parent.id)
      }));
  }

  toggleDropdown(parent: any) {
    parent.isOpen = !parent.isOpen;
  }

  toggleMobileSidebar(): void {
    this.isMobileOpen = !this.isMobileOpen;
    document.body.style.overflow = this.isMobileOpen ? 'hidden' : '';
  }
  
  closeMobileSidebar(): void {
    if (window.innerWidth <= 576) {
      this.isMobileOpen = false;
      document.body.style.overflow = '';
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth > 576) {
      this.isMobileOpen = false;
      document.body.style.overflow = '';
    }
  }
}




