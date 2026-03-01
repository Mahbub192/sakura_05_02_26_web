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
  id?: number;
  fullName: string;
  patientId: string;
  phone: string;
  age?: number;
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
  private refreshInterval: any;

  showUpdatePatientModal = false;
  selectedAppointment: Appointment | null = null;
  editPatientForm = { fullName: '', phone: '', age: 0 as number };
  updatePatientError = '';
  savingPatient = false;

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

  openUpdatePatientModal(apt: Appointment): void {
    this.selectedAppointment = apt;
    this.editPatientForm = {
      fullName: apt.patient.fullName,
      phone: apt.patient.phone || '',
      age: (apt.patient as any).age ?? 0
    };
    this.updatePatientError = '';
    this.showUpdatePatientModal = true;
  }

  closeUpdatePatientModal(): void {
    this.showUpdatePatientModal = false;
    this.selectedAppointment = null;
    this.updatePatientError = '';
  }

  savePatientInfo(): void {
    if (!this.selectedAppointment?.patient?.id) {
      this.updatePatientError = 'Patient ID not found.';
      return;
    }
    this.savingPatient = true;
    this.updatePatientError = '';
    const id = this.selectedAppointment.patient.id;
    this.apiService.put(`/patients/${id}`, {
      fullName: this.editPatientForm.fullName,
      phone: this.editPatientForm.phone,
      age: this.editPatientForm.age
    }).subscribe({
      next: () => {
        if (this.dashboardData) {
          const apt = this.dashboardData.todayAppointments.find(a => a.id === this.selectedAppointment!.id);
          if (apt?.patient) {
            apt.patient.fullName = this.editPatientForm.fullName;
            apt.patient.phone = this.editPatientForm.phone;
            (apt.patient as any).age = this.editPatientForm.age;
          }
        }
        this.closeUpdatePatientModal();
        this.savingPatient = false;
      },
      error: (err) => {
        this.updatePatientError = err.error?.message || 'Failed to update patient info.';
        this.savingPatient = false;
      }
    });
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

  onAppointmentBooked(): void {
    this.loadDashboardData();
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
}
