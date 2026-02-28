import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss'],
})
export class PatientDashboardComponent {
  /** Which sidebar section with sub-items is expanded: 'appointment' | 'health-record' | null (all minimized) */
  expandedNav: 'appointment' | 'health-record' | null = null;

  constructor(public authService: AuthService) {}

  toggleNav(key: 'appointment' | 'health-record'): void {
    this.expandedNav = this.expandedNav === key ? null : key;
  }

  get user() {
    return this.authService.currentUserValue;
  }

  get welcomeName(): string {
    const name = this.user?.fullName?.split(' ')[0] || 'Patient';
    return name;
  }

  get patientIdDisplay(): string {
    const id = this.user?.id;
    return id ? `#ENT${id}` : '';
  }

  logout(): void {
    this.authService.logout();
  }
}
