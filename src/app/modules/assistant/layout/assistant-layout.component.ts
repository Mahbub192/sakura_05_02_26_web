import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-assistant-layout',
  templateUrl: './assistant-layout.component.html',
  styleUrls: ['./assistant-layout.component.scss']
})
export class AssistantLayoutComponent {
  expandedNav: 'appointments' | null = null;
  drawerOpen = false;

  constructor(public authService: AuthService) {}

  toggleNav(key: 'appointments'): void {
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
