import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todays-appointments',
  templateUrl: './todays-appointments.component.html',
  styleUrls: ['./todays-appointments.component.scss']
})
export class TodaysAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  chambers: any[] = [];
  selectedChamberId: number | null = null;
  loading = false;
  error = '';

  statusOptions = [
    { value: 'scheduled', label: 'Scheduled', color: 'blue' },
    { value: 'confirmed', label: 'Confirmed', color: 'green' },
    { value: 'running', label: 'Running', color: 'purple' },
    { value: 'completed', label: 'Completed', color: 'gray' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'no_show', label: 'No Show', color: 'yellow' }
  ];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChambers();
    this.loadTodaysAppointments();
  }

  loadChambers(): void {
    this.apiService.get('/chambers').subscribe({
      next: (response: any) => {
        this.chambers = response.filter((c: any) => c.isActive);
      },
      error: (error) => {
        console.error('Error loading chambers:', error);
      }
    });
  }

  loadTodaysAppointments(): void {
    this.loading = true;
    this.error = '';
    
    const url = this.selectedChamberId 
      ? `/appointments/today?chamberId=${this.selectedChamberId}`
      : '/appointments/today';

    this.apiService.get(url).subscribe({
      next: (response: any) => {
        // Backend now returns { appointments, totalAppointments, ... }
        this.appointments = response.appointments || response;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load appointments';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  onChamberChange(): void {
    this.loadTodaysAppointments();
  }

  getStatusColor(status: string): string {
    const statusOption = this.statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'gray';
  }

  getStatusLabel(status: string): string {
    const statusOption = this.statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
  }

  changeStatus(appointmentId: number, newStatus: string): void {
    if (confirm(`Change status to ${this.getStatusLabel(newStatus)}?`)) {
      this.apiService.put(`/appointments/${appointmentId}/status`, { status: newStatus }).subscribe({
        next: () => {
          this.loadTodaysAppointments();
        },
        error: (error) => {
          alert('Failed to update status');
          console.error('Error:', error);
        }
      });
    }
  }

  togglePresent(appointmentId: number): void {
    this.apiService.put(`/appointments/${appointmentId}/toggle-present`, {}).subscribe({
      next: () => {
        this.loadTodaysAppointments();
      },
      error: (error) => {
        alert('Failed to toggle present status');
        console.error('Error:', error);
      }
    });
  }

  editAppointment(appointmentId: number): void {
    this.router.navigate(['/doctor/appointments/edit', appointmentId]);
  }

  cancelAppointment(appointmentId: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.apiService.delete(`/appointments/${appointmentId}`).subscribe({
        next: () => {
          this.loadTodaysAppointments();
        },
        error: (error) => {
          alert('Failed to cancel appointment');
          console.error('Error:', error);
        }
      });
    }
  }

  getAppointmentStats() {
    return {
      total: this.appointments.length,
      scheduled: this.appointments.filter(a => a.status === 'scheduled').length,
      confirmed: this.appointments.filter(a => a.status === 'confirmed').length,
      running: this.appointments.filter(a => a.status === 'running').length,
      completed: this.appointments.filter(a => a.status === 'completed').length,
      cancelled: this.appointments.filter(a => a.status === 'cancelled').length,
      present: this.appointments.filter(a => a.isPresent).length
    };
  }

  formatTime(time: string | null): string {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${period}`;
  }
}

