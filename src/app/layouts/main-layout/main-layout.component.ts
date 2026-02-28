import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  constructor(private router: Router) {}

  /** Hide public nav/footer when inside patient portal (dashboard, today, book, etc.) */
  get isPatientPortal(): boolean {
    return this.router.url.startsWith('/patient');
  }
}
