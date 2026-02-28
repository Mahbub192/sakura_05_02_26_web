import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';

export interface Assistant {
  id?: number;
  fullName: string;
  age: number;
  phone: string;
  email: string;
  address: string;
  education: string;
}

@Component({
  selector: 'app-assistants',
  templateUrl: './assistants.component.html',
  styleUrls: ['./assistants.component.scss']
})
export class AssistantsComponent implements OnInit {
  assistants: Assistant[] = [];
  loading = false;
  showFormModal = false;
  showDeleteConfirm = false;
  assistantToDelete: Assistant | null = null;
  editingAssistant: Assistant | null = null;
  error = '';
  success = '';
  saving = false;
  formError = '';
  fieldErrors: Record<string, boolean> = {};

  form = {
    fullName: '',
    age: null as number | null,
    phone: '',
    email: '',
    address: '',
    education: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAssistants();
  }

  loadAssistants(): void {
    this.loading = true;
    this.error = '';
    this.apiService.get<Assistant[]>('/assistants').subscribe({
      next: (response: any) => {
        this.assistants = Array.isArray(response) ? response : (response?.data ?? []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading assistants:', err);
        this.error = 'Failed to load assistants.';
        this.assistants = [];
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.editingAssistant = null;
    this.form = {
      fullName: '',
      age: null,
      phone: '',
      email: '',
      address: '',
      education: ''
    };
    this.formError = '';
    this.fieldErrors = {};
    this.showFormModal = true;
  }

  openEditModal(assistant: Assistant): void {
    this.editingAssistant = assistant;
    this.form = {
      fullName: assistant.fullName,
      age: assistant.age,
      phone: assistant.phone,
      email: assistant.email,
      address: assistant.address,
      education: assistant.education
    };
    this.formError = '';
    this.fieldErrors = {};
    this.showFormModal = true;
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.editingAssistant = null;
    this.formError = '';
    this.fieldErrors = {};
  }

  private getInvalidFields(): string[] {
    const invalid: string[] = [];
    if (!this.form.fullName?.trim()) invalid.push('Full Name');
    if (this.form.age == null || this.form.age === undefined || String(this.form.age).trim() === '') invalid.push('Age');
    if (!this.form.phone?.trim()) invalid.push('Phone');
    if (!this.form.email?.trim()) invalid.push('Email');
    if (!this.form.address?.trim()) invalid.push('Address');
    if (!this.form.education?.trim()) invalid.push('Education');
    return invalid;
  }

  private setFieldErrors(): void {
    this.fieldErrors = {
      fullName: !this.form.fullName?.trim(),
      age: this.form.age == null || this.form.age === undefined || String(this.form.age).trim() === '',
      phone: !this.form.phone?.trim(),
      email: !this.form.email?.trim(),
      address: !this.form.address?.trim(),
      education: !this.form.education?.trim()
    };
  }

  saveAssistant(): void {
    this.formError = '';
    this.fieldErrors = {};
    const invalid = this.getInvalidFields();
    if (invalid.length > 0) {
      this.setFieldErrors();
      this.formError = 'Please fill all required fields: ' + invalid.join(', ');
      return;
    }
    this.saving = true;
    this.error = '';
    const body = {
      fullName: this.form.fullName.trim(),
      age: this.form.age ?? 0,
      phone: this.form.phone?.trim() ?? '',
      email: this.form.email?.trim() ?? '',
      address: this.form.address?.trim() ?? '',
      education: this.form.education?.trim() ?? ''
    };
    if (this.editingAssistant?.id) {
      this.apiService.put<Assistant>(`/assistants/${this.editingAssistant.id}`, body).subscribe({
        next: (updated) => {
          const idx = this.assistants.findIndex(a => a.id === this.editingAssistant!.id);
          if (idx !== -1) this.assistants[idx] = { ...this.assistants[idx], ...updated };
          this.success = 'Assistant updated successfully.';
          this.closeFormModal();
          this.saving = false;
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to update assistant.';
          this.saving = false;
        }
      });
    } else {
      this.apiService.post<Assistant>('/assistants', body).subscribe({
        next: (created) => {
          this.assistants = [...this.assistants, created as Assistant];
          this.success = 'Assistant created successfully.';
          this.closeFormModal();
          this.saving = false;
          setTimeout(() => this.success = '', 3000);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to create assistant.';
          this.saving = false;
        }
      });
    }
  }

  confirmDelete(assistant: Assistant): void {
    this.assistantToDelete = assistant;
    this.showDeleteConfirm = true;
  }

  deleteAssistant(): void {
    if (!this.assistantToDelete?.id) {
      this.showDeleteConfirm = false;
      this.assistantToDelete = null;
      return;
    }
    const id = this.assistantToDelete.id;
    this.apiService.delete(`/assistants/${id}`).subscribe({
      next: () => {
        this.assistants = this.assistants.filter(a => a.id !== id);
        this.success = 'Assistant deleted successfully.';
        this.showDeleteConfirm = false;
        this.assistantToDelete = null;
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to delete assistant.';
        this.showDeleteConfirm = false;
        this.assistantToDelete = null;
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.assistantToDelete = null;
  }
}
