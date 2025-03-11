import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { globalServicesDecorator } from '../../Services/global-services.decorator';

interface User {
  id: number;
  name: string;
}

interface user_data {
  id: number;
  name: string;
}

interface Permission {
  menu_id: number;
  menu_name: string;
  add_rights: string;
  update_rights: string;
  delete_rights: string;
  view_rights: string;
}

@Component({
  selector: 'app-user-permission',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-permission.component.html',
  styleUrl: './user-permission.component.css'
})
export class UserPermissionComponent implements OnInit {
  users: user_data[] = [{ id: 1, name: '' }];
  modules: any[] = [];
  selectedUser: number = 0;
  showDetails: boolean = false;
  selectedId: string = '';
  permission: any;
  user_permission_data: Permission[] = [{ menu_id: 1, menu_name: '', add_rights: '', view_rights: '', delete_rights: '', update_rights: '' }]

  constructor(private GSD: globalServicesDecorator ,  private cdr: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    this.loadUsers();
    this.checkPermissions();
  }


  checkPermissions(): void {
    this.GSD.globalRouting.checkPermissions('user_rights', () => {
      // Set permissions for UI elements
      this.permission = this.GSD.globalRouting.permissions;
      this.cdr.detectChanges();
      console.log(this.permission);
    });
    
  }

  permissionForm = new FormGroup({
    permission_data: new FormArray([
      this.permission_array()
    ])
  });

  permission_data = this.permissionForm.get('permission_data') as FormArray;

  permission_array(): FormGroup {
    return new FormGroup({
      user_id: new FormControl(''),
      add_rights: new FormControl(''),
      update_rights: new FormControl(''),
      delete_rights: new FormControl(''),
      view_rights: new FormControl(''),
      menu_id: new FormControl(''),
      menu_name: new FormControl(''),
    })
  }

  loadUsers(): void {
    const formData = new FormData();
    formData.append('action', 'get list');
    formData.append('table_name', 'user_master');
    formData.append('fields', 'id,user_name as name');

    this.GSD.globalRouting.api('dropdown', 'get_dropdown', formData, (res: any) => {
      if (res.statusCode == 200) {
        this.users = res.data;
      } else {
        this.GSD.global.toast(res.message, 'danger');
      }
    }
    );
  }

  checkPermission(selectedUserId: string) {

    if (selectedUserId === '0') {
      this.showDetails = false;
      return;
    }
    this.selectedId = selectedUserId;
    const formData = new FormData();
    formData.append('id', selectedUserId);
    formData.append('action', 'get user right');
    formData.append('table_name', 'user_rights');

    this.GSD.globalRouting.api('user_rights', 'get_user_rights', formData,
      (res: any) => {
        if (res.statusCode == 200) {
          this.showDetails = true;
          this.user_permission_data = res.data;

          this.permission_data.clear();

          this.user_permission_data.forEach((ele, index) => {

            this.permission_data.push(this.permission_array());

            this.permission_data.at(index).patchValue({
              'menu_name': ele.menu_name,
              'user_id': selectedUserId,
              'menu_id': ele.menu_id,
              'add_rights': this.permission_checker(ele.add_rights),
              'update_rights': this.permission_checker(ele.update_rights),
              'delete_rights': this.permission_checker(ele.delete_rights),
              'view_rights': this.permission_checker(ele.view_rights),
            })

          })
        } else {
          this.GSD.global.toast(res.message, 'danger');
        }
      });

  }

  permission_checker(val: string) {

    if (val == '1') {
      return 1;
    } else {
      return 0;
    }

  }


  insert_permissions() {

    const formData = new FormData();

    formData.append('action', 'set user right');
    formData.append('table_name', 'user_rights');

    formData.append('user_id' , this.selectedId)
    formData.append('data', JSON.stringify(this.permissionForm.value));

    this.GSD.globalRouting.api('user_rights', 'set_user_rights', formData, (res: any) => {

      if(res.statusCode == 200){
        this.GSD.global.toast(res.message, 'success');
      }else{
        this.GSD.global.toast(res.message, 'danger');
      }

      }
    )
  }
  

  // reset form fileds
  resetPermissions() {
    // const permissionArray = this.User_permission.get('permission_fields') as FormArray;
    const permission_array = this.permissionForm.get('permission_data') as FormArray;
  
    permission_array.controls.forEach((permissionForm) => {
      permissionForm.patchValue({
        add_rights: false,
        delete_rights: false,
        update_rights: false,
        view_rights: false
      });
    });
  }



}
