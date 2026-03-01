import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-doctor-layout',
  templateUrl: './doctor-layout.component.html',
  styleUrls: ['./doctor-layout.component.scss'],
})
export class DoctorLayoutComponent {
  expandedNav: 'appointments' | 'chambers' | 'team' | null = null;
  drawerOpen = false;

  constructor(public authService: AuthService) {}

  toggleNav(key: 'appointments' | 'chambers' | 'team'): void {
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

  logout(): void {
    this.authService.logout();
  }
}
