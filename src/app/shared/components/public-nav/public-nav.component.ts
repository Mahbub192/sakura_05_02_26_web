import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-public-nav',
  templateUrl: './public-nav.component.html',
  styleUrls: ['./public-nav.component.scss'],
})
export class PublicNavComponent {
  drawerOpen = false;

  constructor(public authService: AuthService) {}

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

  logout(): void {
    this.authService.logout();
  }
}
