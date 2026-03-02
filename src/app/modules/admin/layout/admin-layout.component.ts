import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
  drawerOpen = false;

  constructor(public authService: AuthService) {}

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
