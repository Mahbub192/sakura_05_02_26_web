import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {
  activeTab: 'today' | 'upcoming' | 'old' = 'today';
  loading = false;
  appointments: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.loading = true;
    // Mock data
    setTimeout(() => {
      this.appointments = [
        { id: 1, patientName: 'John Doe', date: '2026-02-05', time: '10:00 AM', status: 'confirmed' },
        { id: 2, patientName: 'Jane Smith', date: '2026-02-05', time: '11:00 AM', status: 'pending' }
      ];
      this.loading = false;
    }, 500);
  }

  selectTab(tab: 'today' | 'upcoming' | 'old'): void {
    this.activeTab = tab;
    this.loadAppointments();
  }

  createAppointment(): void {
    this.router.navigate(['/doctor/appointments/new']);
  }
}


