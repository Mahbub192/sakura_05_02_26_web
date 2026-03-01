import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-assistant-upcoming-appointments',
  template: `
    <div class="mx-auto max-w-4xl">
      <h1 class="text-2xl font-black tracking-tight text-dark-green flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-dark-green text-2xl">event_upcoming</span>
        Upcoming Appointments
      </h1>
      <p class="text-slate-600 text-sm mb-6">Upcoming appointments for your doctor’s chambers</p>
      <div *ngIf="loading" class="text-center py-8">Loading...</div>
      <div *ngIf="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{{ error }}</div>
      <div *ngIf="!loading && !error && appointments.length === 0" class="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        No upcoming appointments.
      </div>
      <div *ngIf="!loading && appointments.length > 0" class="space-y-3">
        <div *ngFor="let a of appointments" class="bg-white rounded-xl border border-dark-green/10 shadow-sm p-4 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-dark-green">{{ a.patient?.fullName }}</h3>
            <p class="text-xs text-slate-500">{{ a.patient?.patientId }} · {{ a.chamber?.name }}</p>
            <p class="text-xs text-slate-600 mt-1">{{ a.appointmentDate }} {{ a.appointmentTime || '' }}</p>
          </div>
          <span class="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">{{ a.status }}</span>
        </div>
      </div>
    </div>
  `
})
export class UpcomingAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.apiService.get('/appointments/upcoming').subscribe({
      next: (res: any) => {
        this.appointments = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load upcoming appointments.';
        this.loading = false;
      }
    });
  }
}
