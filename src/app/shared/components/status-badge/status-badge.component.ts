import { Component, Input } from '@angular/core';

export type AppointmentStatus = 'serialized' | 'running' | 'seen' | 'absent' | 'next' | 'call_from_dr' | 'need_test';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() status: AppointmentStatus = 'serialized';

  getStatusLabel(): string {
    const labels: Record<AppointmentStatus, string> = {
      'serialized': 'Waiting',
      'running': 'Running',
      'seen': 'Completed',
      'absent': 'Absent',
      'next': 'Next',
      'call_from_dr': 'Call from Dr',
      'need_test': 'Need Test'
    };
    return labels[this.status] || this.status;
  }

  getStatusClass(): string {
    const classes: Record<AppointmentStatus, string> = {
      'serialized': 'badge-serialized',
      'running': 'badge-running',
      'seen': 'badge-seen',
      'absent': 'badge-absent',
      'next': 'badge-next',
      'call_from_dr': 'bg-purple-100 text-purple-800',
      'need_test': 'bg-orange-100 text-orange-800'
    };
    return classes[this.status] || 'badge-serialized';
  }
}


