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
}

interface Appointment {
  id: number;
  serialNumber: number;
  patient: Patient;
  appointmentTime: string;
  status: string;
  isPresent: boolean;
  identifier?: string;
  chamber: { name: string };
  appointmentDate: string;
}

interface DashboardData {
  stats?: ChamberStats;
  todayAppointments: Appointment[];
}

interface Chamber {
  id: number;
  name: string;
  isActive: boolean;
}

@Component({
  selector: 'app-assistant-dashboard',
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
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadChambers(): void {
    this.apiService.get('/chambers').subscribe({
      next: (response: any) => {
        this.chambers = Array.isArray(response) ? response.filter((c: any) => c.isActive) : [];
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
    const params: string[] = [];
    if (this.selectedChamberId) params.push(`chamberId=${this.selectedChamberId}`);
    if (this.selectedDate) params.push(`date=${this.selectedDate}`);
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';

    this.apiService.get(`/appointments/today${queryString}`).subscribe({
      next: (response: any) => {
        if (response.appointments) {
          this.dashboardData = {
            stats: {
              total: response.totalAppointments || 0,
              waiting: response.waitingAppointments || 0,
              running: response.runningAppointments || 0,
              seen: response.seenAppointments || 0,
              absent: response.absentAppointments || 0,
              report: response.reportAppointments || 0
            },
            todayAppointments: response.appointments
          };
        } else {
          this.dashboardData = { todayAppointments: response || [] };
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
    this.refreshInterval = setInterval(() => this.loadDashboardData(), 30000);
  }

  stopAutoRefresh(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  getStats(): ChamberStats {
    if (this.dashboardData?.stats) return this.dashboardData.stats;
    if (!this.dashboardData?.todayAppointments) {
      return { total: 0, waiting: 0, running: 0, seen: 0, absent: 0, report: 0 };
    }
    const a = this.dashboardData.todayAppointments;
    return {
      total: a.length,
      waiting: a.filter(x => ['scheduled', 'confirmed', 'serialized'].includes(x.status)).length,
      running: a.filter(x => x.status === 'running').length,
      seen: a.filter(x => ['seen', 'completed'].includes(x.status)).length,
      absent: a.filter(x => ['absent', 'no_show'].includes(x.status) || !x.isPresent).length,
      report: a.filter(x => x.status === 'need_test').length
    };
  }

  togglePresent(appointmentId: number): void {
    this.apiService.put(`/appointments/${appointmentId}/toggle-present`, {}).subscribe({
      next: () => {
        if (this.dashboardData) {
          const apt = this.dashboardData.todayAppointments.find(a => a.id === appointmentId);
          if (apt) apt.isPresent = !apt.isPresent;
        }
      },
      error: () => alert('Failed to update patient presence. Please try again.')
    });
  }

  changeStatus(appointmentId: number, newStatus: string): void {
    this.apiService.put(`/appointments/${appointmentId}/status`, { status: newStatus }).subscribe({
      next: () => {
        if (this.dashboardData) {
          const apt = this.dashboardData.todayAppointments.find(a => a.id === appointmentId);
          if (apt) apt.status = newStatus;
        }
      },
      error: () => alert('Failed to update appointment status. Please try again.')
    });
  }

  cancelAppointment(appointmentId: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.changeStatus(appointmentId, 'cancelled');
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      scheduled: 'Scheduled', confirmed: 'Confirmed', serialized: 'Serialized',
      running: 'Running', seen: 'Seen', completed: 'Completed', absent: 'Absent',
      next: 'Next', call_from_dr: 'Called', need_test: 'Need Test', cancelled: 'Cancelled', no_show: 'No Show'
    };
    return labels[status] || status;
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return '';
    const d = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const input = new Date(dateString);
    input.setHours(0, 0, 0, 0);
    if (input.getTime() === today.getTime()) return 'Today';
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (input.getTime() === tomorrow.getTime()) return 'Tomorrow';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (input.getTime() === yesterday.getTime()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }

  activeBreak: any = null;

  onBreak(breakData: { notes: string; duration: number }): void {
    this.apiService.post('/breaks/start', {
      notes: breakData.notes,
      duration: breakData.duration,
      chamberId: this.selectedChamberId || undefined
    }).subscribe({
      next: (response: any) => {
        this.activeBreak = response;
        this.loadDashboardData();
      },
      error: (e) => alert(e.error?.message || 'Failed to start break. Please try again.')
    });
  }

  cancelBreak(): void {
    if (!this.activeBreak) return;
    if (confirm('Are you sure you want to cancel the current break?')) {
      const params = this.selectedChamberId ? `?chamberId=${this.selectedChamberId}` : '';
      this.apiService.delete(`/breaks/end${params}`).subscribe({
        next: () => {
          this.activeBreak = null;
          this.loadDashboardData();
        },
        error: (e) => alert(e.error?.message || 'Failed to cancel break.')
      });
    }
  }

  onNextPatient(): void {
    if (!this.dashboardData?.todayAppointments?.length) {
      alert('No patients in queue!');
      return;
    }
    const timeToMin = (t: string | null | undefined): number => {
      if (!t) return Infinity;
      let s = t.trim();
      if (s.length === 5) s += ':00';
      const [h, m] = s.split(':').map(Number);
      return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
    };
    const waiting = this.dashboardData.todayAppointments
      .filter(apt => apt.isPresent && ['scheduled', 'confirmed', 'serialized'].includes(apt.status))
      .sort((a, b) => {
        const ta = timeToMin(a.appointmentTime);
        const tb = timeToMin(b.appointmentTime);
        return ta !== tb ? ta - tb : (a.serialNumber || 0) - (b.serialNumber || 0);
      });
    if (waiting.length === 0) {
      alert('No waiting patients!');
      return;
    }
    const next = waiting[0];
    if (confirm(`Call next patient?\n\nSerial #${next.serialNumber}\n${next.patient.fullName}`)) {
      this.apiService.put(`/appointments/${next.id}/status`, { status: 'running' }).subscribe({
        next: () => this.loadDashboardData(),
        error: () => alert('Failed to call patient. Please try again.')
      });
    }
  }

  onAppointmentBooked(): void {
    this.loadDashboardData();
  }

  onTestNext(): void {
    if (!this.dashboardData?.todayAppointments?.length) {
      alert('No patients in queue!');
      return;
    }
    const running = this.dashboardData.todayAppointments.find(a => a.status === 'running');
    if (!running) {
      this.showTestList = !this.showTestList;
      if (this.showTestList && this.getTestPatients().length === 0) {
        alert('No patients waiting for tests!');
        this.showTestList = false;
      }
      return;
    }
    this.apiService.put(`/appointments/${running.id}/status`, { status: 'need_test' }).subscribe({
      next: () => {
        const timeToMin = (t: string | null | undefined): number => {
          if (!t) return Infinity;
          let s = t.trim();
          if (s.length === 5) s += ':00';
          const [h, m] = s.split(':').map(Number);
          return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
        };
        const waiting = this.dashboardData!.todayAppointments
          .filter(apt => apt.isPresent && ['scheduled', 'confirmed', 'serialized'].includes(apt.status))
          .sort((a, b) => {
            const ta = timeToMin(a.appointmentTime);
            const tb = timeToMin(b.appointmentTime);
            return ta !== tb ? ta - tb : (a.serialNumber || 0) - (b.serialNumber || 0);
          });
        if (waiting.length > 0) {
          this.apiService.put(`/appointments/${waiting[0].id}/status`, { status: 'running' }).subscribe({
            next: () => {
              this.showTestList = true;
              this.loadDashboardData();
            },
            error: () => this.loadDashboardData()
          });
        } else {
          this.showTestList = true;
          this.loadDashboardData();
        }
      },
      error: () => alert('Failed to send patient to test. Please try again.')
    });
  }

  getSortedPatients(): Appointment[] {
    if (!this.dashboardData?.todayAppointments) return [];
    const timeToMin = (t: string | null | undefined): number => {
      if (!t) return Infinity;
      let s = t.trim();
      if (s.length === 5) s += ':00';
      const [h, m] = s.split(':').map(Number);
      return (isNaN(h) ? 0 : h) * 60 + (isNaN(m) ? 0 : m);
    };
    return [...this.dashboardData.todayAppointments].sort((a, b) => {
      if (a.status === 'running' && b.status !== 'running') return -1;
      if (a.status !== 'running' && b.status === 'running') return 1;
      const ta = timeToMin(a.appointmentTime);
      const tb = timeToMin(b.appointmentTime);
      return ta !== tb ? ta - tb : (a.serialNumber || 0) - (b.serialNumber || 0);
    });
  }

  getTestPatients(): Appointment[] {
    if (!this.dashboardData?.todayAppointments) return [];
    return this.dashboardData.todayAppointments
      .filter(apt => apt.isPresent && apt.status === 'need_test')
      .sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0));
  }

  assignTestSerial(appointment: Appointment): void {
    if (confirm(`Call patient for lab test?\n\nSerial #${appointment.serialNumber}\n${appointment.patient.fullName}`)) {
      this.apiService.put(`/appointments/${appointment.id}/status`, { status: 'next' }).subscribe({
        next: () => this.loadDashboardData(),
        error: () => alert('Failed to call patient for test. Please try again.')
      });
    }
  }
}
