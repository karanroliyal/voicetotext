import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { globalServicesDecorator } from '../../Services/global-services.decorator';
import { FormValidationMessagesComponent } from '../../Utility/form-validation-messages/form-validation-messages.component';
import { PagginationComponent } from '../../Utility/paggination/paggination.component';

declare var bootstrap: any;

@Component({
  selector: 'app-user-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormValidationMessagesComponent, PagginationComponent],
  templateUrl: './user-master.component.html',
  styleUrl: './user-master.component.css'
})
export class UserMasterComponent implements OnInit {
  userForm!: FormGroup;
  filterForm!: FormGroup;
  users: any[] = [];
  isLoading: boolean = false;
  isEditMode: boolean = false;
  currentPage: number = 1;
  totalRecords: number = 0;
  totalPages: number = 0;
  recordsPerPage: number = 4;
  Math = Math;
  permission:any;

  constructor(private GSD: globalServicesDecorator ,  private cdr: ChangeDetectorRef) {
    
    this.initializeForms();
  }

  private initializeForms(): void {
    this.userForm = new FormGroup({
      id: new FormControl(''),
      user_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
      user_email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(50)]),
      phone_no: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(12)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]),
      action: new FormControl('insert'),
      table_name: new FormControl('user_master')
    });

    this.filterForm = new FormGroup({
      user_name: new FormControl(''),
      user_email: new FormControl(''),
      phone_no: new FormControl(''),
      sortOn: new FormControl('id'),
      limit: new FormControl(this.recordsPerPage),
      sortOrder: new FormControl('DESC'),
      current_page: new FormControl(1),
      fields: new FormControl('id,user_name,user_email,phone_no'),
      action: new FormControl('get_records'),
      table_name: new FormControl('user_master')
    });
  }

  ngOnInit(): void {
   
    this.checkPermissions();
    this.loadUsers();
    this.setupTabListeners();
  }

  checkPermissions(): void {
    this.GSD.globalRouting.checkPermissions('user_master', () => {
      // Set permissions for UI elements
      this.permission = this.GSD.globalRouting.permissions;
      this.cdr.detectChanges();
    });
    
  }

  private setupTabListeners(): void {
    // Add event listener for tab changes
    document.getElementById('all-users-tab')?.addEventListener('shown.bs.tab', () => {
      this.resetForm();
    });
  }


  loadUsers(): void {
    const formValues = {
      user_name: this.filterForm.get('user_name')?.value || '',
      user_email: this.filterForm.get('user_email')?.value || '',
      phone_no: this.filterForm.get('phone_no')?.value || '',
      sortOn: this.filterForm.get('sortOn')?.value || 'id',
      limit: this.filterForm.get('limit')?.value || this.recordsPerPage,
      sortOrder: this.filterForm.get('sortOrder')?.value || 'DESC',
      current_page: this.filterForm.get('current_page')?.value || 1,
      fields: this.filterForm.get('fields')?.value || 'id,user_name,user_email,phone_no',
      action: 'get table',
      table_name: 'user_master'
    };

    const formData = this.GSD.globalFunction.convertToFormdata(formValues);

    this.GSD.globalRouting.api('crud', 'table_creator', formData,
      (res: any) => {
        if (res.records !== undefined) {
          this.users = res.records;
          this.totalRecords = res.total_records;
          this.totalPages = res.total_pages;
          this.currentPage = res.current_page;
          this.recordsPerPage = res.per_page;
        } else if (res.statusCode === 200 && res.data) {
          this.users = res.data.records;
          this.totalRecords = res.data.total_records;
          this.totalPages = res.data.total_pages;
          this.currentPage = res.data.current_page;
          this.recordsPerPage = res.data.per_page;
        } else {
          console.error('API error:', res);
          this.GSD.global.toast(res.message || 'Error loading users', 'danger');
        }
      });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.GSD.globalFunction.convertToFormdata(this.userForm.value);

      this.GSD.globalRouting.api('crud', 'insert_update_operation', formData,
        (res: any) => {
          if (res.statusCode == 200) {
            this.GSD.global.toast(res.message, 'success');
            this.resetForm();
            this.loadUsers();
            // Switch to home tab
            const addUserTab = document.getElementById('all-users-tab');
            if (addUserTab) {
              const tab = new bootstrap.Tab(addUserTab);
              tab.show();
            }
          } else {
            this.GSD.global.toast(res.message, 'danger');
          }
        });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  editUser(id: number): void {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('action', 'edit');
    formData.append('table_name', 'user_master');

    this.userForm.controls['password'].setValidators([Validators.minLength(8), Validators.maxLength(20)])
    this.userForm.controls['password'].updateValueAndValidity();

    this.GSD.globalRouting.api('crud', 'get_edit_data', formData,
      (res: any) => {
        if (res.statusCode == 200) {
          this.isEditMode = true;
          this.userForm.patchValue({
            id: res.data.id,
            user_name: res.data.user_name,
            user_email: res.data.user_email,
            phone_no: res.data.phone_no,
            action: 'update'
          });

          // Switch to add/edit tab
          const addUserTab = document.getElementById('add-user-tab');
          if (addUserTab) {
            const tab = new bootstrap.Tab(addUserTab);
            tab.show();
          }
        } else {
          this.GSD.global.toast(res.message, 'danger');
        }
      });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      const formData = new FormData();
      formData.append('id', id.toString());
      formData.append('action', 'delete');
      formData.append('table_name', 'user_master');

      this.GSD.globalRouting.api('crud', 'delete_data', formData,
        (res: any) => {
          if (res.statusCode == 200) {
            this.GSD.global.toast(res.message, 'success');
            this.loadUsers();
          } else {
            this.GSD.global.toast(res.message, 'danger');
          }
        });
    }
  }

  resetForm(): void {
    this.userForm.reset({
      action: 'insert',
      table_name: 'user_master'
    });
    this.isEditMode = false;
  }

  applyFilter(): void {
    this.filterForm.patchValue({ current_page: 1 });
    this.loadUsers();
  }

  resetFilter(): void {
    this.filterForm.patchValue({
      user_name: '',
      user_email: '',
      phone_no: '',
      current_page: 1
    });
    this.loadUsers();
  }

  changePage(page: number): void {
    this.filterForm.patchValue({ current_page: page });
    this.loadUsers();
  }

  refreshData(): void {
    this.loadUsers();
  }

  onLimitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newLimit = parseInt(select.value);
    this.recordsPerPage = newLimit;
    this.filterForm.patchValue({
      limit: newLimit,
      current_page: 1
    });
    this.loadUsers();
  }
}
