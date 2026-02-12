import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upcoming-appointments',
  templateUrl: './upcoming-appointments.component.html',
  styleUrls: ['./upcoming-appointments.component.scss']
})
export class UpcomingAppointmentsComponent implements OnInit {
  appointments: any[] = [];
  chambers: any[] = [];
  selectedChamberId: number | null = null;
  loading = false;
  error = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChambers();
    this.loadUpcomingAppointments();
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

  loadUpcomingAppointments(): void {
    this.loading = true;
    this.error = '';
    
    const url = this.selectedChamberId 
      ? `/appointments/upcoming?chamberId=${this.selectedChamberId}`
      : '/appointments/upcoming';

    this.apiService.get(url).subscribe({
      next: (response: any) => {
        this.appointments = response;
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
    this.loadUpcomingAppointments();
  }

  editAppointment(appointmentId: number): void {
    this.router.navigate(['/doctor/appointments/edit', appointmentId]);
  }

  cancelAppointment(appointmentId: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.apiService.delete(`/appointments/${appointmentId}`).subscribe({
        next: () => {
          this.loadUpcomingAppointments();
        },
        error: (error) => {
          alert('Failed to cancel appointment');
          console.error('Error:', error);
        }
      });
    }
  }

  groupByDate(appointments: any[]): { date: string, appointments: any[] }[] {
    const groups: { [key: string]: any[] } = {};
    
    appointments.forEach(appointment => {
      const date = new Date(appointment.appointmentDate).toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
    });

    return Object.keys(groups).map(date => ({
      date,
      appointments: groups[date]
    }));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  formatTime(time: string | null): string {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${period}`;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'scheduled': 'blue',
      'confirmed': 'green',
      'cancelled': 'red'
    };
    return colors[status] || 'gray';
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  }
}

