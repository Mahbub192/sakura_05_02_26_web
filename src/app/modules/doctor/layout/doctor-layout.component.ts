import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-doctor-layout',
  templateUrl: './doctor-layout.component.html',
  styleUrls: ['./doctor-layout.component.scss'],
})
export class DoctorLayoutComponent {
  expandedNav: 'appointments' | 'chambers' | null = null;

  constructor(public authService: AuthService) {}

  toggleNav(key: 'appointments' | 'chambers'): void {
    this.expandedNav = this.expandedNav === key ? null : key;
  }

  get user() {
    return this.authService.currentUserValue;
  }

  logout(): void {
    this.authService.logout();
  }
}
