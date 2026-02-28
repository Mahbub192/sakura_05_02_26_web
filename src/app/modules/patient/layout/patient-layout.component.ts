import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-patient-layout',
  templateUrl: './patient-layout.component.html',
  styleUrls: ['./patient-layout.component.scss'],
})
export class PatientLayoutComponent {
  expandedNav: 'appointment' | 'health-record' | null = null;

  constructor(public authService: AuthService) {}

  toggleNav(key: 'appointment' | 'health-record'): void {
    this.expandedNav = this.expandedNav === key ? null : key;
  }

  get user() {
    return this.authService.currentUserValue;
  }

  get patientIdDisplay(): string {
    const id = this.user?.id;
    return id ? `#ENT${id}` : '';
  }

  logout(): void {
    this.authService.logout();
  }
}
