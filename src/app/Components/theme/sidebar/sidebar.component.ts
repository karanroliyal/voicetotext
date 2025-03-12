import { Component, OnInit, HostListener } from '@angular/core';
import { globalServicesDecorator } from '../../../Services/global-services.decorator';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

interface menuData {

  priority: string,
  menu_name: string,
  route: string,
  icon_class: string,
  parent_id: string,
  id: string

}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NgClass, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})


export class SidebarComponent implements OnInit {

  menu: [] = [];
  parents_menu: any = [];
  isMobileOpen: boolean = false;

  constructor(public GSD: globalServicesDecorator) { }


  menu_array: menuData[] = [{ menu_name: '', priority: '', route: '', icon_class: '', parent_id: '', id: '' }];

  ngOnInit(): void {
    setTimeout(() => {
      this.get_menu();
      this.loadMenu();
    }, 200);

    // For dropdown state 
    const savedState = JSON.parse(localStorage.getItem('sidebarState') || '{}');
    setTimeout(()=>{
      this.parents_menu.forEach((parent: any) => {
        parent.isOpen = savedState[parent.id] ?? false;
      });
    }, 300)
  }

  get_menu() {
    let menu: any = localStorage.getItem('menu');
    if (!menu) {
      console.warn('No menu found in localStorage.');
      return;
    }
    this.menu_array = JSON.parse(menu);
  }

  loadMenu() {
    this.parents_menu = this.menu_array.filter((ele) => ele.parent_id === "0").map((parent) => ({
      ...parent,
      children: this.menu_array.filter((child) => child.parent_id === parent.id)
    }));
  }


  toggleDropdown(parent: any) {
    parent.isOpen = !parent.isOpen;

    const savedState = JSON.parse(localStorage.getItem('sidebarState') || '{}');
    savedState[parent.id] = parent.isOpen;
    localStorage.setItem('sidebarState', JSON.stringify(savedState));

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




