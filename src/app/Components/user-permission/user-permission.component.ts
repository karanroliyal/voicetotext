import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { globalServicesDecorator } from '../../Services/global-services.decorator';

interface User {
  id: number;
  name: string;
}

interface Module {
  id: number;
  name: string;
}

interface Permission {
  menu_id: number;
  menu_name: string;
  add_rights: boolean;
  update_rights: boolean;
  delete_rights: boolean;
  view_rights: boolean;
}

@Component({
  selector: 'app-user-permission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-permission.component.html',
  styleUrl: './user-permission.component.css'
})
export class UserPermissionComponent implements OnInit {
  permissionForm: FormGroup;
  users: User[] = [];
  modules: any[] = [];
  selectedUser: number = 0;
  isLoading: boolean = false;
  showDetails: boolean = false;
  
  constructor(private GSD: globalServicesDecorator) {
    this.permissionForm = new FormGroup({
      user_id: new FormControl(0),
      permission_data: new FormArray([])
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
    this.loadModules();
  }
  
  get permission_data(): FormArray {
    return this.permissionForm.get('permission_data') as FormArray;
  }
  
  loadUsers(): void {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('action', 'get_users');
    formData.append('table_name', 'user_master');
    formData.append('fields', 'id,user_name as name');
    
    this.GSD.globalRouting.api('dropdown', 'get_dropdown', formData,
      (res: any) => {
        this.isLoading = false;
        if (res.statusCode == 200) {
          this.users = res.data;
        } else {
          this.GSD.global.toast(res.message, 'danger');
        }
      });
  }
  
  loadModules(): void {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('action', 'get_modules');
    formData.append('table_name', 'menu_master');
    formData.append('fields', 'id,menu_name');
    
    this.GSD.globalRouting.api('dropdown', 'get_dropdown', formData,
      (res: any) => {
        this.isLoading = false;
        if (res.statusCode == 200) {
          this.modules = res.data;
        } else {
          this.GSD.global.toast(res.message, 'danger');
        }
      });
  }
  
  checkPermission(userId: string): void {
    if (userId === '0') {
      this.showDetails = false;
      return;
    }
    
    this.selectedUser = parseInt(userId);
    this.isLoading = true;
    this.showDetails = false;
    
    const formData = new FormData();
    formData.append('id', userId);
    formData.append('action', 'get_user_rights');
    formData.append('table_name', 'user_rights');
    
    this.GSD.globalRouting.api('user_rights', 'get_user_rights', formData,
      (res: any) => {
        this.isLoading = false;
        if (res.statusCode == 200) {
          this.showDetails = true;
          this.buildPermissionForm(res.data, parseInt(userId));
        } else {
          this.GSD.global.toast(res.message, 'danger');
        }
      });
  }
  
  buildPermissionForm(permissions: Permission[], userId: number): void {
    // Clear existing form array
    while (this.permission_data.length) {
      this.permission_data.removeAt(0);
    }
    
    // Set user ID
    this.permissionForm.patchValue({ user_id: userId });
    
    // Add permissions to form array
    permissions.forEach(permission => {
      this.permission_data.push(
        new FormGroup({
          menu_id: new FormControl(permission.menu_id),
          menu_name: new FormControl(permission.menu_name),
          user_id: new FormControl(userId),
          add_records: new FormControl(permission.add_rights),
          update_records: new FormControl(permission.update_rights),
          delete_records: new FormControl(permission.delete_rights),
          view_page: new FormControl(permission.view_rights)
        })
      );
    });
  }
  
  submit(): void {
    if (this.permissionForm.valid) {
      this.isLoading = true;
      const formData = this.GSD.globalFunction.convertToFormdata(this.permissionForm);
      formData.append('action', 'set_user_rights');
      formData.append('table_name', 'user_rights');
      
      this.GSD.globalRouting.api('user_rights', 'set_user_rights', formData,
        (res: any) => {
          this.isLoading = false;
          if (res.statusCode == 200) {
            this.GSD.global.toast(res.message, 'success');
          } else {
            this.GSD.global.toast(res.message, 'danger');
          }
        });
    }
  }
  
  assignPermission(): void {
    if (this.permissionForm.valid) {
      const userId = this.permissionForm.get('user_id')?.value;
      const moduleId = this.permissionForm.get('module_id')?.value;
      
      if (!userId || !moduleId) {
        this.GSD.global.toast('Please select user and module', 'danger');
        return;
      }
      
      this.isLoading = true;
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append('menu_id', moduleId);
      formData.append('add_rights', this.permissionForm.get('add_rights')?.value ? '1' : '0');
      formData.append('update_rights', this.permissionForm.get('update_rights')?.value ? '1' : '0');
      formData.append('delete_rights', this.permissionForm.get('delete_rights')?.value ? '1' : '0');
      formData.append('view_rights', this.permissionForm.get('view_rights')?.value ? '1' : '0');
      formData.append('action', 'assign_permission');
      formData.append('table_name', 'user_rights');
      
      this.GSD.globalRouting.api('user_rights', 'set_user_rights', formData,
        (res: any) => {
          this.isLoading = false;
          if (res.statusCode == 200) {
            this.GSD.global.toast(res.message, 'success');
            // Refresh permissions
            this.checkPermission(userId);
          } else {
            this.GSD.global.toast(res.message, 'danger');
          }
        });
    }
  }
}
