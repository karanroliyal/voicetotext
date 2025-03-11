import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { globalServicesDecorator } from '../../Services/global-services.decorator';
import { FormValidationMessagesComponent } from '../../Utility/form-validation-messages/form-validation-messages.component';
import { PagginationComponent } from '../../Utility/paggination/paggination.component';

declare var bootstrap: any;

@Component({
  selector: 'app-language-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormValidationMessagesComponent, PagginationComponent],
  templateUrl: './language-master.component.html',
  styleUrl: './language-master.component.css'
})
export class LanguageMasterComponent implements OnInit {
  languages: any[] = [];
  isEditMode: boolean = false;
  currentPage: number = 1;
  totalRecords: number = 0;
  totalPages: number = 0;
  recordsPerPage: number = 4;
  Math = Math;
  res: any;
  permission: any;
 

  constructor(private GSD: globalServicesDecorator  ,  private cdr: ChangeDetectorRef) {
  }
  languageForm = new FormGroup({
    id: new FormControl(''),
    language_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
    language_code: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(5)]),
    action: new FormControl('insert'),
    table_name: new FormControl('language_master')
  });

  filterForm = new FormGroup({
    language_name: new FormControl(''),
    language_code: new FormControl(''),
    status: new FormControl(''),
    sortOn: new FormControl('id'),
    limit: new FormControl(this.recordsPerPage),
    sortOrder: new FormControl('DESC'),
    current_page: new FormControl(1),
    fields: new FormControl('id , language_name , language_code'),
    table_name: new FormControl('language_master'),
    action: new FormControl('get table')
  });


  ngOnInit(): void {
    this.loadLanguages();
    this.setupTabListeners();
    this.checkPermissions();
  }



  private setupTabListeners(): void {
    // Add event listener for tab changes
    document.getElementById('all-languages-tab')?.addEventListener('shown.bs.tab', () => {
      this.resetForm();
    });
  }

  checkPermissions(): void {
    this.GSD.globalRouting.checkPermissions('language_master', () => {
      this.permission = this.GSD.globalRouting.permissions;
      this.cdr.detectChanges();
    });
  }

  loadLanguages(): void {
    const formData = this.GSD.globalFunction.convertToFormdata(this.filterForm);
    this.GSD.globalRouting.api('crud', 'table_creator', formData,
      (res: any) => {
        if (res.records !== undefined) {
          this.languages = res.records;
          this.totalRecords = res.total_records;
          this.currentPage = res.current_page;
          this.recordsPerPage = res.per_page;
          this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
        } else if (res.statusCode === 200 && res.data) {
          this.languages = res.data.records;
          this.totalRecords = res.data.total_records;
          this.currentPage = res.data.current_page;
          this.recordsPerPage = res.data.per_page;
          this.totalPages = Math.ceil(this.totalRecords / this.recordsPerPage);
        } else {
          this.GSD.global.toast(res.message || 'Error loading languages', 'danger');
        }
      });
  }

  onSubmit(): void {

    if (this.languageForm.valid) {
      const formData = this.GSD.globalFunction.convertToFormdata(this.languageForm);

      this.GSD.globalRouting.api('crud', 'insert_update_operation', formData,
        (res: any) => {
          if (res.statusCode == 200) {
            this.GSD.global.toast(res.message, 'success');
            this.resetForm();
            this.loadLanguages();

            // Switch to all languages tab
            const allLanguagesTab = document.getElementById('all-languages-tab');
            if (allLanguagesTab) {
              const tab = new bootstrap.Tab(allLanguagesTab);
              tab.show();
            }
          } else {
            this.GSD.global.toast(res.message, 'danger');
          }
        });
    } else {
      this.languageForm.markAllAsTouched();
    }
  }

  editLanguage(id: number): void {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('action', 'edit');
    formData.append('table_name', 'language_master');

    this.GSD.globalRouting.api('crud', 'get_edit_data', formData,
      (res: any) => {
        if (res.statusCode == 200) {
          this.isEditMode = true;
          this.languageForm.patchValue({
            id: res.data.id,
            language_name: res.data.language_name,
            language_code: res.data.language_code,
            action: 'update'
          });

          // Switch to add/edit tab
          const addLanguageTab = document.getElementById('add-language-tab');
          if (addLanguageTab) {
            const tab = new bootstrap.Tab(addLanguageTab);
            tab.show();
          }
        } else {
          this.GSD.global.toast(res.message, 'danger');
        }
      });
  }

  deleteLanguage(id: number): void {
    if (confirm('Are you sure you want to delete this language?')) {
      const formData = new FormData();
      formData.append('id', id.toString());
      formData.append('action', 'delete');
      formData.append('table_name', 'language_master');

      this.GSD.globalRouting.api('crud', 'delete_data', formData,
        (res: any) => {
          if (res.statusCode == 200) {
            this.GSD.global.toast(res.message, 'success');
            this.loadLanguages();
          } else {
            this.GSD.global.toast(res.message, 'danger');
          }
        });
    }
  }

  resetForm(): void {
    this.languageForm.reset({
      action: 'insert',
      table_name: 'language_master'
    });
    this.isEditMode = false;
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.filterForm.patchValue({ current_page: 1 });
    this.loadLanguages();
  }

  resetFilter(): void {
    this.filterForm.patchValue({
      language_name: '',
      language_code: '',
      status: '',
      current_page: 1,
      sortOn: 'id',
      sortOrder: 'DESC'
    });
    this.loadLanguages();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterForm.patchValue({ current_page: page });
      this.loadLanguages();
    }
  }

  onLimitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newLimit = parseInt(select.value);
    this.recordsPerPage = newLimit;
    this.filterForm.patchValue({
      limit: newLimit,
      current_page: 1
    });
    this.loadLanguages();
  }

  refreshData(): void {
    this.loadLanguages();
  }
}