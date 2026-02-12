import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-history',
  templateUrl: './appointment-history.component.html',
  styleUrls: ['./appointment-history.component.scss']
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  chambers: any[] = [];
  
  // Filters
  selectedChamberId: number | null = null;
  selectedStatus: string = '';
  startDate: string = '';
  endDate: string = '';
  searchTerm: string = '';
  
  loading = false;
  error = '';

  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' }
  ];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadChambers();
    this.setDefaultDates();
    this.loadAppointmentHistory();
  }

  setDefaultDates(): void {
    // Set end date to today
    const today = new Date();
    this.endDate = today.toISOString().split('T')[0];
    
    // Set start date to 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
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

  loadAppointmentHistory(): void {
    this.loading = true;
    this.error = '';
    
    let url = '/appointments?';
    const params: string[] = [];

    if (this.selectedChamberId) {
      params.push(`chamberId=${this.selectedChamberId}`);
    }
    if (this.selectedStatus) {
      params.push(`status=${this.selectedStatus}`);
    }

    url += params.join('&');

    this.apiService.get(url).subscribe({
      next: (response: any) => {
        this.appointments = response;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load appointments';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.appointments];

    // Date range filter
    if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(apt => new Date(apt.appointmentDate) >= start);
    }
    if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(apt => new Date(apt.appointmentDate) <= end);
    }

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(apt =>
        apt.patient?.fullName?.toLowerCase().includes(term) ||
        apt.patient?.phone?.includes(term) ||
        apt.patient?.patientId?.toLowerCase().includes(term)
      );
    }

    this.filteredAppointments = filtered;
  }

  onFilterChange(): void {
    this.loadAppointmentHistory();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  viewDetails(appointmentId: number): void {
    // Navigate to appointment details view (to be implemented)
    alert(`View details for appointment #${appointmentId}`);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
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
      'completed': 'green',
      'cancelled': 'red',
      'no_show': 'yellow',
      'scheduled': 'blue',
      'confirmed': 'indigo',
      'running': 'purple'
    };
    return colors[status] || 'gray';
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  }

  exportToCSV(): void {
    // CSV export functionality
    const csv = this.generateCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  generateCSV(): string {
    const headers = ['Date', 'Serial', 'Patient Name', 'Phone', 'Chamber', 'Time', 'Status', 'Fee'];
    const rows = this.filteredAppointments.map(apt => [
      this.formatDate(apt.appointmentDate),
      apt.serialNumber,
      apt.patient?.fullName || '',
      apt.patient?.phone || '',
      apt.chamber?.name || '',
      this.formatTime(apt.appointmentTime),
      this.getStatusLabel(apt.status),
      apt.fee || 0
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  getStatistics() {
    return {
      total: this.filteredAppointments.length,
      completed: this.filteredAppointments.filter(a => a.status === 'completed').length,
      cancelled: this.filteredAppointments.filter(a => a.status === 'cancelled').length,
      noShow: this.filteredAppointments.filter(a => a.status === 'no_show').length,
      totalRevenue: this.filteredAppointments
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.fee || 0), 0)
    };
  }
}

