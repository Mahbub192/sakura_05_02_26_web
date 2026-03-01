import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-assistant-chambers-list',
  template: `
    <div class="mx-auto max-w-4xl">
      <h1 class="text-2xl font-black tracking-tight text-dark-green flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-dark-green text-2xl">apartment</span>
        Chambers
      </h1>
      <p class="text-slate-600 text-sm mb-6">Chambers for your doctor</p>
      <div *ngIf="loading" class="text-center py-8">Loading...</div>
      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{{ error }}</div>
      <div *ngIf="!loading && !error && chambers.length === 0" class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        No chambers found.
      </div>
      <div *ngIf="!loading && chambers.length > 0" class="space-y-3">
        <div *ngFor="let c of chambers" class="bg-white rounded-xl border border-dark-green/10 shadow-sm p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-green">{{ c.name }}</h3>
            <p class="text-xs text-slate-500">{{ c.address }}</p>
          </div>
          <span class="px-2 py-1 text-xs rounded-full" [ngClass]="c.isActive ? 'bg-accent-green/20 text-dark-green' : 'bg-slate-100 text-slate-600'">
            {{ c.isActive ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class ChambersListComponent implements OnInit {
  chambers: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.apiService.get('/chambers').subscribe({
      next: (res: any) => {
        this.chambers = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load chambers.';
        this.loading = false;
      }
    });
  }
}
