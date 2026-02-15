import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Router } from '@angular/router';

interface ChamberStats {
  total: number;
  waiting: number;
  running: number;
  seen: number;
  absent: number;
  report: number;
}

interface Patient {
  fullName: string;
  patientId: string;
  phone: string;
  isNewPatient: boolean;
}

interface Appointment {
  id: number;
  serialNumber: number;
  patient: Patient;
  appointmentTime: string;
  status: string;
  isPresent: boolean;
  chamber: {
    name: string;
  };
  appointmentDate: string;
}

interface DashboardData {
  stats?: ChamberStats;
  todayAppointments: Appointment[];
  recentAppointments?: Appointment[];
}

interface Chamber {
  id: number;
  name: string;
  isActive: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  chambers: Chamber[] = [];
  selectedChamberId: number | null = null;
  selectedDate: string = '';
  dashboardData: DashboardData | null = null;
  loading = false;
  error: string | null = null;
  showTestList = false;
  private refreshInterval: any;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setDefaultDate();
    this.loadChambers();
    this.startAutoRefresh();
  }
  
  setDefaultDate(): void {
    // Set today's date as default
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadChambers(): void {
    this.apiService.get('/chambers').subscribe({
      next: (response: any) => {
        this.chambers = response.filter((c: any) => c.isActive);
        if (this.chambers.length > 0) {
          this.selectedChamberId = this.chambers[0].id;
        }
        this.loadDashboardData();
      },
      error: (err) => {
        console.error('Failed to load chambers', err);
        this.error = 'Failed to load chambers. Please try again.';
      }
    });
  }

  onChamberChange(): void {
    this.loadDashboardData();
  }
  
  onDateChange(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Build query parameters
    const params: string[] = [];
    
    if (this.selectedChamberId) {
      params.push(`chamberId=${this.selectedChamberId}`);
    }
    
    if (this.selectedDate) {
      params.push(`date=${this.selectedDate}`);
    }
    
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';

    this.apiService.get(`/appointments/today${queryString}`).subscribe({
      next: (response: any) => {
        // Backend now returns { appointments, totalAppointments, waitingAppointments, ... }
        if (response.appointments) {
          // New format from backend with stats
          this.dashboardData = {
            stats: {
              total: response.totalAppointments || 0,
              waiting: response.waitingAppointments || 0,
              running: response.runningAppointments || 0,
              seen: response.seenAppointments || 0,
              absent: response.absentAppointments || 0,
              report: response.reportAppointments || 0
            },
            todayAppointments: response.appointments,
            recentAppointments: []
          };
        } else {
          // Fallback for old format (just array)
          this.dashboardData = {
            todayAppointments: response
          };
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data:', err);
        this.error = 'Failed to load dashboard data. Please try again.';
        this.loading = false;
      }
    });
  }

  startAutoRefresh(): void {
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getStats(): ChamberStats {
    // Use pre-calculated stats from backend if available
    if (this.dashboardData?.stats) {
      return this.dashboardData.stats;
    }

    // Fallback: Calculate stats from appointments
    if (!this.dashboardData || !this.dashboardData.todayAppointments) {
      return {
        total: 0,
        waiting: 0,
        running: 0,
        seen: 0,
        absent: 0,
        report: 0
      };
    }

    const appointments = this.dashboardData.todayAppointments;
    
    return {
      total: appointments.length,
      waiting: appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed' || a.status === 'serialized').length,
      running: appointments.filter(a => a.status === 'running').length,
      seen: appointments.filter(a => a.status === 'seen' || a.status === 'completed').length,
      absent: appointments.filter(a => a.status === 'absent' || a.status === 'no_show' || !a.isPresent).length,
      report: appointments.filter(a => a.status === 'need_test').length
    };
  }

  togglePresent(appointmentId: number): void {
    this.apiService.put(`/appointments/${appointmentId}/toggle-present`, {}).subscribe({
      next: () => {
        // Update local state
        if (this.dashboardData) {
          const apt = this.dashboardData.todayAppointments.find(a => a.id === appointmentId);
          if (apt) {
            apt.isPresent = !apt.isPresent;
          }
        }
      },
      error: (err) => {
        console.error('Failed to toggle present status', err);
        alert('Failed to update patient presence. Please try again.');
      }
    });
  }

  changeStatus(appointmentId: number, newStatus: string): void {
    this.apiService.put(`/appointments/${appointmentId}/status`, { status: newStatus }).subscribe({
      next: () => {
        // Update local state
        if (this.dashboardData) {
          const apt = this.dashboardData.todayAppointments.find(a => a.id === appointmentId);
          if (apt) {
            apt.status = newStatus;
          }
        }
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert('Failed to update appointment status. Please try again.');
      }
    });
  }

  cancelAppointment(appointmentId: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.changeStatus(appointmentId, 'cancelled');
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'scheduled': 'Scheduled',
      'confirmed': 'Confirmed',
      'serialized': 'Serialized',
      'running': 'Running',
      'seen': 'Seen',
      'completed': 'Completed',
      'absent': 'Absent',
      'next': 'Next',
      'call_from_dr': 'Called',
      'need_test': 'Need Test',
      'cancelled': 'Cancelled',
      'no_show': 'No Show'
    };
    return labels[status] || status;
  }
  
  getFormattedDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const inputDate = new Date(dateString);
    inputDate.setHours(0, 0, 0, 0);
    
    if (inputDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (inputDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else if (inputDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }
  
  onBreak(breakData: { notes: string; duration: number }): void {
    console.log('Break started:', breakData);
    
    // Show break notification
    const breakMessage = breakData.notes 
      ? `Taking a break: ${breakData.notes} (${breakData.duration} minutes)`
      : `Taking a ${breakData.duration} minute break`;
    
    if (confirm(breakMessage + '\n\nBreak will be displayed on TV screen. Continue?')) {
      // TODO: Implement break API endpoint to save break status
      // This will be displayed on TV display
      alert(`Break started for ${breakData.duration} minutes!\n\nNote: ${breakData.notes || 'No notes'}`);
      
      // Optionally pause auto-refresh during break
      this.stopAutoRefresh();
      
      // Auto-resume after break duration
      setTimeout(() => {
        this.startAutoRefresh();
        alert('Break ended! Auto-refresh resumed.');
      }, breakData.duration * 60 * 1000);
    }
  }
  
  onNextPatient(): void {
    if (!this.dashboardData || this.dashboardData.todayAppointments.length === 0) {
      alert('No patients in queue!');
      return;
    }
    
    // Helper function to convert time string to minutes for comparison
    const timeToMinutes = (timeStr: string | null | undefined): number => {
      if (!timeStr) return Infinity; // Put times without time at end
      
      // Normalize time format (handle both HH:mm and HH:mm:ss)
      let normalizedTime = timeStr.trim();
      if (normalizedTime.length === 5) {
        normalizedTime = normalizedTime + ':00';
      }
      
      // Parse HH:mm:ss format
      const parts = normalizedTime.split(':');
      if (parts.length < 2) return Infinity;
      
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes)) return Infinity;
      
      return hours * 60 + minutes;
    };
    
    // Find the next waiting patient (sorted by appointment time - soto theke bro)
    const waitingPatients = this.dashboardData.todayAppointments
      .filter(apt => apt.isPresent && (apt.status === 'scheduled' || apt.status === 'confirmed' || apt.status === 'serialized'))
      .sort((a, b) => {
        // Sort by appointment time (soto theke bro - morning to evening)
        const timeA = timeToMinutes(a.appointmentTime);
        const timeB = timeToMinutes(b.appointmentTime);
        
        if (timeA !== timeB) {
          return timeA - timeB; // Sort by time (smaller time first)
        }
        
        // If times are equal, sort by serial number
        return (a.serialNumber || 0) - (b.serialNumber || 0);
      });
    
    if (waitingPatients.length === 0) {
      alert('No waiting patients!');
      return;
    }
    
    const nextPatient = waitingPatients[0]; // First patient by time (soto theke bro)
    
    if (confirm(`Call next patient?\n\nSerial #${nextPatient.serialNumber}\n${nextPatient.patient.fullName}`)) {
      // Update status to 'next' or 'running'
      this.apiService.put(`/appointments/${nextPatient.id}/status`, { status: 'running' }).subscribe({
        next: () => {
          // Voice announcement (mock)
          this.announcePatient(nextPatient);
          this.loadDashboardData();
        },
        error: (err) => {
          console.error('Failed to call next patient', err);
          alert('Failed to call patient. Please try again.');
        }
      });
    }
  }
  
  onAppointmentBooked(): void {
    // Refresh dashboard data after appointment is booked
    this.loadDashboardData();
  }

  onTestNext(): void {
    if (!this.dashboardData || this.dashboardData.todayAppointments.length === 0) {
      alert('No patients in queue!');
      return;
    }
    
    // Find current running patient
    const runningPatient = this.dashboardData.todayAppointments.find(
      apt => apt.status === 'running'
    );
    
    if (!runningPatient) {
      // No running patient, just toggle test list
      this.showTestList = !this.showTestList;
      if (this.showTestList && this.getTestPatients().length === 0) {
        alert('No patients waiting for tests!');
        this.showTestList = false;
      }
      return;
    }
    
    // Send running patient to test
    this.apiService.put(`/appointments/${runningPatient.id}/status`, { status: 'need_test' }).subscribe({
      next: () => {
        // Helper function to convert time string to minutes for comparison
        const timeToMinutes = (timeStr: string | null | undefined): number => {
          if (!timeStr) return Infinity; // Put times without time at end
          
          // Normalize time format (handle both HH:mm and HH:mm:ss)
          let normalizedTime = timeStr.trim();
          if (normalizedTime.length === 5) {
            normalizedTime = normalizedTime + ':00';
          }
          
          // Parse HH:mm:ss format
          const parts = normalizedTime.split(':');
          if (parts.length < 2) return Infinity;
          
          const hours = parseInt(parts[0], 10);
          const minutes = parseInt(parts[1], 10);
          
          if (isNaN(hours) || isNaN(minutes)) return Infinity;
          
          return hours * 60 + minutes;
        };
        
        // Find next waiting patient (sorted by appointment time - soto theke bro)
        const waitingPatients = this.dashboardData!.todayAppointments
          .filter(apt => apt.isPresent && 
            (apt.status === 'scheduled' || 
             apt.status === 'confirmed' || 
             apt.status === 'serialized'))
          .sort((a, b) => {
            // Sort by appointment time (soto theke bro - morning to evening)
            const timeA = timeToMinutes(a.appointmentTime);
            const timeB = timeToMinutes(b.appointmentTime);
            
            if (timeA !== timeB) {
              return timeA - timeB; // Sort by time (smaller time first)
            }
            
            // If times are equal, sort by serial number
            return (a.serialNumber || 0) - (b.serialNumber || 0);
          });
        
        if (waitingPatients.length > 0) {
          const nextPatient = waitingPatients[0]; // First patient by time (soto theke bro)
          
          // Call next patient
          this.apiService.put(`/appointments/${nextPatient.id}/status`, { status: 'running' }).subscribe({
            next: () => {
              // Show notification
              alert(`Patient sent to test: ${runningPatient.patient.fullName}\n\nNext patient called: ${nextPatient.patient.fullName}`);
              
              // Open test list and refresh
              this.showTestList = true;
              this.loadDashboardData();
            },
            error: (err) => {
              console.error('Failed to call next patient', err);
              alert('Failed to call next patient.');
              this.loadDashboardData();
            }
          });
        } else {
          // No waiting patients, just send to test
          alert(`Patient sent to test: ${runningPatient.patient.fullName}\n\nNo more patients waiting.`);
          this.showTestList = true;
          this.loadDashboardData();
        }
      },
      error: (err) => {
        console.error('Failed to send patient to test', err);
        alert('Failed to send patient to test. Please try again.');
      }
    });
  }
  
  /**
   * Get sorted patient list by appointment time (soto theke bro - morning to evening)
   */
  getSortedPatients(): Appointment[] {
    if (!this.dashboardData || !this.dashboardData.todayAppointments) {
      return [];
    }
    
    // Helper function to convert time string to minutes for comparison
    const timeToMinutes = (timeStr: string | null | undefined): number => {
      if (!timeStr) return Infinity; // Put times without time at end
      
      // Normalize time format (handle both HH:mm and HH:mm:ss)
      let normalizedTime = timeStr.trim();
      if (normalizedTime.length === 5) {
        normalizedTime = normalizedTime + ':00';
      }
      
      // Parse HH:mm:ss format
      const parts = normalizedTime.split(':');
      if (parts.length < 2) return Infinity;
      
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes)) return Infinity;
      
      return hours * 60 + minutes;
    };
    
    // Sort by appointment time (soto theke bro - morning to evening)
    return [...this.dashboardData.todayAppointments].sort((a, b) => {
      // Running patients always go to top
      if (a.status === 'running' && b.status !== 'running') return -1;
      if (a.status !== 'running' && b.status === 'running') return 1;
      
      // If both are running or both are not running, sort by time
      const timeA = timeToMinutes(a.appointmentTime);
      const timeB = timeToMinutes(b.appointmentTime);
      
      if (timeA !== timeB) {
        return timeA - timeB; // Sort by time (smaller time first)
      }
      
      // If times are equal, sort by serial number
      return (a.serialNumber || 0) - (b.serialNumber || 0);
    });
  }

  getTestPatients(): Appointment[] {
    if (!this.dashboardData || !this.dashboardData.todayAppointments) {
      return [];
    }
    
    // Find patients needing tests (sorted by serial number)
    return this.dashboardData.todayAppointments
      .filter(apt => apt.isPresent && apt.status === 'need_test')
      .sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0));
  }
  
  assignTestSerial(appointment: Appointment): void {
    if (confirm(`Call patient for lab test?\n\nSerial #${appointment.serialNumber}\n${appointment.patient.fullName}`)) {
      // Change status from 'need_test' to 'next' (indicates lab test in progress)
      this.apiService.put(`/appointments/${appointment.id}/status`, { status: 'next' }).subscribe({
        next: () => {
          // Announce for test
          this.announceTestPatient(appointment);
          
          // Show success message
          alert(`Patient ${appointment.patient.fullName} called for lab test.\n\nPatient will appear in main list with "Lab Test" type.`);
          
          // Refresh data
          this.loadDashboardData();
        },
        error: (err) => {
          console.error('Failed to call patient for test', err);
          alert('Failed to call patient for test. Please try again.');
        }
      });
    }
  }
  
  private announcePatient(appointment: Appointment): void {
    // Mock voice announcement
    const message = `Patient number ${appointment.serialNumber}, ${appointment.patient.fullName}, please come to the consultation room.`;
    console.log('🔊 Voice Announcement:', message);
    
    // Show visual notification
    this.showNotification(`Serial #${appointment.serialNumber} - ${appointment.patient.fullName}`, 'Next Patient');
    
    // TODO: Integrate with actual text-to-speech API
    // this.textToSpeech.speak(message);
  }
  
  private announceTestPatient(appointment: Appointment): void {
    // Mock voice announcement for test patient
    const message = `Patient number ${appointment.serialNumber}, ${appointment.patient.fullName}, please proceed to the testing area.`;
    console.log('🔊 Test Announcement:', message);
    
    // Show visual notification
    this.showNotification(`Serial #${appointment.serialNumber} - ${appointment.patient.fullName}`, 'Test Patient');
    
    // TODO: Integrate with actual text-to-speech API
    // this.textToSpeech.speak(message);
  }
  
  private showNotification(message: string, title: string): void {
    // Simple browser notification (can be replaced with better UI)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/assets/logo.png'
      });
    } else {
      // Fallback to alert
      alert(`${title}\n\n${message}`);
    }
  }
}
