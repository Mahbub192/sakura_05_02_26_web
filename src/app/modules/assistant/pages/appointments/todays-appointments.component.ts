import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assistant-todays-appointments',
  template: `
    <div class="mx-auto max-w-4xl">
      <h1 class="text-2xl font-black tracking-tight text-dark-green flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-dark-green text-2xl">calendar_today</span>
        Today's Appointments
      </h1>
      <p class="text-slate-600 text-sm mb-6">View and manage today’s appointments from the dashboard.</p>
      <a
        routerLink="/assistant/dashboard"
        class="inline-flex items-center gap-2 rounded-lg bg-ent-primary text-white px-4 py-2 text-sm font-bold hover:opacity-90">
        <span class="material-symbols-outlined">dashboard</span>
        Go to Dashboard
      </a>
    </div>
  `
})
export class TodaysAppointmentsComponent {
  constructor(private router: Router) {}
}
