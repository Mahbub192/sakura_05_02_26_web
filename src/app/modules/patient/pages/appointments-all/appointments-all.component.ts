import { Component } from '@angular/core';

interface AppointmentItem {
  id: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: 'virtual' | 'in-clinic';
  status: 'upcoming' | 'checked-in' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-appointments-all',
  templateUrl: './appointments-all.component.html',
  styleUrls: ['./appointments-all.component.scss'],
})
export class AppointmentsAllComponent {
  activeTab: 'upcoming' | 'past' = 'upcoming';

  upcomingList: AppointmentItem[] = [
    { id: '1', doctorName: 'Dr. Sarah Jenkins', department: 'Ear Department', date: 'Feb 28, 2026', time: '09:00 AM - 09:30 AM', type: 'virtual', status: 'checked-in' },
    { id: '2', doctorName: 'Dr. Marcus Thorne', department: 'Nose & Sinus', date: 'Feb 28, 2026', time: '11:15 AM - 12:00 PM', type: 'in-clinic', status: 'upcoming' },
    { id: '3', doctorName: 'Dr. Elena Rodriguez', department: 'Throat & Vocal', date: 'Feb 28, 2026', time: '02:30 PM - 03:00 PM', type: 'virtual', status: 'upcoming' },
    { id: '4', doctorName: 'Dr. Sarah Jenkins', department: 'Ear Department', date: 'Mar 5, 2026', time: '10:00 AM - 10:30 AM', type: 'in-clinic', status: 'upcoming' },
  ];

  pastList: AppointmentItem[] = [
    { id: '5', doctorName: 'Dr. Michael Chen', department: 'General ENT', date: 'Feb 20, 2026', time: '09:00 AM - 09:45 AM', type: 'in-clinic', status: 'completed' },
    { id: '6', doctorName: 'Dr. Sarah Jenkins', department: 'Ear Department', date: 'Feb 12, 2026', time: '02:00 PM - 02:30 PM', type: 'virtual', status: 'completed' },
    { id: '7', doctorName: 'Dr. Elena Rodriguez', department: 'Throat & Vocal', date: 'Jan 28, 2026', time: '11:00 AM - 11:45 AM', type: 'in-clinic', status: 'completed' },
  ];

  setTab(tab: 'upcoming' | 'past'): void {
    this.activeTab = tab;
  }

  getStatusClass(status: AppointmentItem['status']): string {
    switch (status) {
      case 'checked-in': return 'bg-accent-green/10 text-accent-green ring-accent-green/20';
      case 'upcoming': return 'bg-blue-500/10 text-blue-600 ring-blue-500/20';
      case 'completed': return 'bg-slate-200 text-slate-600 ring-slate-300/50';
      case 'cancelled': return 'bg-red-100 text-red-600 ring-red-200';
      default: return 'bg-slate-200 text-slate-600';
    }
  }

  getStatusLabel(status: AppointmentItem['status']): string {
    switch (status) {
      case 'checked-in': return 'Checked-in';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  }
}
