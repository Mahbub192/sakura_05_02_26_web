import { Component } from '@angular/core';

@Component({
  selector: 'app-appointments-today',
  templateUrl: './appointments-today.component.html',
  styleUrls: ['./appointments-today.component.scss'],
})
export class AppointmentsTodayComponent {
  activeTab: 'upcoming' | 'completed' = 'upcoming';
  todayLabel = this.getTodayLabel();

  private getTodayLabel(): string {
    const d = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = days[d.getDay()];
    const date = d.getDate();
    const suffix = date === 1 || date === 21 || date === 31 ? 'st' : date === 2 || date === 22 ? 'nd' : date === 3 || date === 23 ? 'rd' : 'th';
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day}, ${month} ${date}${suffix}, ${year}`;
  }

  setTab(tab: 'upcoming' | 'completed'): void {
    this.activeTab = tab;
  }
}
