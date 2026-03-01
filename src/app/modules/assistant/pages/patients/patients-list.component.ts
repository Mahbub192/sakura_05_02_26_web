import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-assistant-patients-list',
  template: `
    <div class="mx-auto max-w-4xl">
      <h1 class="text-2xl font-black tracking-tight text-dark-green flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-dark-green text-2xl">person</span>
        Patients
      </h1>
      <p class="text-slate-600 text-sm mb-6">Patients for your doctor</p>
      <div class="flex gap-2 mb-4">
        <input
          type="text"
          [(ngModel)]="search"
          (input)="loadPatients()"
          placeholder="Search by name or phone..."
          class="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-accent-green focus:border-transparent">
      </div>
      <div *ngIf="loading" class="text-center py-8">Loading...</div>
      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{{ error }}</div>
      <div *ngIf="!loading && !error && result.data.length === 0" class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        No patients found.
      </div>
      <div *ngIf="!loading && result.data.length > 0" class="bg-white rounded-xl border border-dark-green/5 overflow-hidden">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Phone</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr *ngFor="let p of result.data" class="hover:bg-slate-50">
              <td class="px-4 py-2 text-sm text-slate-700">{{ p.patientId }}</td>
              <td class="px-4 py-2 text-sm font-medium text-slate-900">{{ p.fullName }}</td>
              <td class="px-4 py-2 text-sm text-slate-600">{{ p.phone }}</td>
            </tr>
          </tbody>
        </table>
        <div class="px-4 py-2 text-xs text-slate-500 border-t border-slate-200">
          Total: {{ result.total }} (page {{ result.page }})
        </div>
      </div>
    </div>
  `
})
export class PatientsListComponent implements OnInit {
  search = '';
  result: { data: any[]; total: number; page: number } = { data: [], total: 0, page: 1 };
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.error = null;
    const params = new URLSearchParams();
    if (this.search) params.set('search', this.search);
    params.set('page', '1');
    params.set('limit', '50');
    this.apiService.get(`/patients?${params.toString()}`).subscribe({
      next: (res: any) => {
        this.result = {
          data: res.data || [],
          total: res.total ?? 0,
          page: res.page ?? 1
        };
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load patients.';
        this.loading = false;
      }
    });
  }
}
