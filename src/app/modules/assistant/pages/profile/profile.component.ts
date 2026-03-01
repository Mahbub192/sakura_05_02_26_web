import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-assistant-profile',
  template: `
    <div class="mx-auto max-w-2xl">
      <h1 class="text-2xl font-black tracking-tight text-dark-green flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-dark-green text-2xl">person</span>
        Profile
      </h1>
      <p class="text-slate-600 text-sm mb-6">Your assistant account details</p>
      <div *ngIf="loading" class="text-center py-8">Loading...</div>
      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{{ error }}</div>
      <div *ngIf="!loading && profile" class="bg-white rounded-xl border border-dark-green/10 shadow-sm p-6 space-y-3">
        <p><span class="text-slate-500 text-sm">Name:</span> <strong>{{ profile.fullName }}</strong></p>
        <p><span class="text-slate-500 text-sm">Phone:</span> {{ profile.phone }}</p>
        <p><span class="text-slate-500 text-sm">Email:</span> {{ profile.email || '–' }}</p>
        <p><span class="text-slate-500 text-sm">Role:</span> Assistant</p>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  loading = false;
  error: string | null = null;

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.apiService.get('/auth/me').subscribe({
      next: (res: any) => {
        this.profile = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load profile.';
        this.loading = false;
      }
    });
  }
}
