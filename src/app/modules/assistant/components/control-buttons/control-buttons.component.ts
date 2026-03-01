import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assistant-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.scss']
})
export class AssistantControlButtonsComponent {
  @Output() refresh = new EventEmitter<void>();
  @Output() break = new EventEmitter<{ notes: string; duration: number }>();
  @Output() next = new EventEmitter<void>();
  @Output() testNext = new EventEmitter<void>();
  @Output() appointmentBooked = new EventEmitter<void>();

  showBreakModal = false;
  breakNotes = '';
  breakDuration = 15;

  constructor(private router: Router) {}

  onRefresh(): void {
    this.refresh.emit();
  }

  openBreakModal(): void {
    this.showBreakModal = true;
  }

  closeBreakModal(): void {
    this.showBreakModal = false;
    this.breakNotes = '';
    this.breakDuration = 15;
  }

  confirmBreak(): void {
    this.break.emit({ notes: this.breakNotes, duration: this.breakDuration });
    this.closeBreakModal();
  }

  onNext(): void {
    this.next.emit();
  }

  onTestNext(): void {
    this.testNext.emit();
  }

  goToBookAppointment(): void {
    this.router.navigate(['/assistant/appointments/new']);
  }
}
