import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-control-buttons',
  templateUrl: './control-buttons.component.html',
  styleUrls: ['./control-buttons.component.scss']
})
export class ControlButtonsComponent {
  @Output() refresh = new EventEmitter<void>();
  @Output() break = new EventEmitter<{ notes: string; duration: number }>();
  @Output() next = new EventEmitter<void>();
  @Output() testNext = new EventEmitter<void>();

  showBreakModal = false;
  breakNotes = '';
  breakDuration = 15;

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
}


