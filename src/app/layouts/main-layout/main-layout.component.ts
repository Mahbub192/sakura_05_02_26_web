import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  constructor(private router: Router) {}

  get isPatientDashboard(): boolean {
    const url = this.router.url;
    return url.startsWith('/patient/dashboard');
  }
}
