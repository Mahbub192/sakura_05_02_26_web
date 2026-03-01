import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-assistant-slot-list',
  template: `
    <div class="mx-auto max-w-4xl">
      <h1 class="text-2xl font-black tracking-tight text-dark-green flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-dark-green text-2xl">schedule</span>
        Appointment Slots
      </h1>
      <p class="text-slate-600 text-sm mb-6">View available slots by chamber and date.</p>
      <div class="flex flex-wrap gap-4 mb-6">
        <select [(ngModel)]="chamberId" (change)="loadSlots()" class="input w-64">
          <option value="">Select chamber</option>
          <option *ngFor="let c of chambers" [value]="c.id">{{ c.name }}</option>
        </select>
        <input type="date" [(ngModel)]="date" (change)="loadSlots()" class="input w-48">
      </div>
      <div *ngIf="loading" class="text-center py-8">Loading...</div>
      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{{ error }}</div>
      <div *ngIf="!loading && !error && slots.length === 0 && chamberId" class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        No slots for this chamber on the selected date.
      </div>
      <div *ngIf="!loading && slots.length > 0" class="space-y-2">
        <div *ngFor="let s of slots" class="bg-white rounded-lg border border-dark-green/10 p-3 flex items-center justify-between">
          <span class="font-medium text-dark-green">{{ s.startTime }} - {{ s.endTime }}</span>
          <span class="text-xs text-slate-500">{{ s.bookedPatients }} / {{ s.maxPatients }} booked</span>
          <span class="px-2 py-0.5 text-xs rounded-full" [ngClass]="s.isActive ? 'bg-accent-green/20 text-dark-green' : 'bg-slate-100'">{{ s.isActive ? 'Active' : 'Inactive' }}</span>
        </div>
      </div>
    </div>
  `
})
export class SlotListComponent implements OnInit {
  chambers: any[] = [];
  chamberId = '';
  date = '';
  slots: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.date = new Date().toISOString().split('T')[0];
    this.apiService.get('/chambers').subscribe({
      next: (res: any) => {
        this.chambers = Array.isArray(res) ? res.filter((c: any) => c.isActive) : [];
      }
    });
  }

  loadSlots(): void {
    if (!this.chamberId) {
      this.slots = [];
      return;
    }
    this.loading = true;
    this.error = null;
    const params = new URLSearchParams();
    params.set('chamberId', this.chamberId);
    if (this.date) params.set('date', this.date);
    this.apiService.get(`/appointment-slots?${params.toString()}`).subscribe({
      next: (res: any) => {
        this.slots = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load slots.';
        this.loading = false;
      }
    });
  }
}
