import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assistant-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.scss']
})
export class AssistantControlButtonsComponent {
  @Output() refresh = new EventEmitter<void>();
  @Output() appointmentBooked = new EventEmitter<void>();

  constructor(private router: Router) {}

  onRefresh(): void {
    this.refresh.emit();
  }

  goToBookAppointment(): void {
    this.router.navigate(['/assistant/appointments/new']);
  }
}
