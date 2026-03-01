import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-assistant-layout',
  templateUrl: './assistant-layout.component.html',
  styleUrls: ['./assistant-layout.component.scss']
})
export class AssistantLayoutComponent {
  expandedNav: 'appointments' | null = null;

  constructor(public authService: AuthService) {}

  toggleNav(key: 'appointments'): void {
    this.expandedNav = this.expandedNav === key ? null : key;
  }

  get user() {
    return this.authService.currentUserValue;
  }

  logout(): void {
    this.authService.logout();
  }
}
