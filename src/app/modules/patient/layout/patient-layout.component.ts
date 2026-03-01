import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-patient-layout',
  templateUrl: './patient-layout.component.html',
  styleUrls: ['./patient-layout.component.scss'],
})
export class PatientLayoutComponent {
  expandedNav: 'appointment' | 'health-record' | null = null;
  drawerOpen = false;

  constructor(public authService: AuthService) {}

  toggleNav(key: 'appointment' | 'health-record'): void {
    this.expandedNav = this.expandedNav === key ? null : key;
  }

  openDrawer(): void {
    this.drawerOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    document.body.style.overflow = '';
  }

  toggleDrawer(): void {
    this.drawerOpen = !this.drawerOpen;
    document.body.style.overflow = this.drawerOpen ? 'hidden' : '';
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
