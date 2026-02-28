import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements AfterViewInit {
  currentYear = new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  /** Dashboard route based on logged-in user role */
  get dashboardRoute(): string {
    const user = this.authService.currentUserValue;
    if (!user) return '';
    return `/${user.role}/dashboard`;
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => this.scrollTo(fragment), 100);
      }
    });
  }

  scrollTo(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
