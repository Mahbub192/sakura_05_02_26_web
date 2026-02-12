import { Component, Input } from '@angular/core';

interface Stats {
  total: number;
  waiting: number;
  running: number;
  seen: number;
  absent: number;
  report: number;
}

@Component({
  selector: 'app-chamber-stats',
  templateUrl: './chamber-stats.component.html',
  styleUrls: ['./chamber-stats.component.scss']
})
export class ChamberStatsComponent {
  @Input() stats: Stats = {
    total: 0,
    waiting: 0,
    running: 0,
    seen: 0,
    absent: 0,
    report: 0
  };
}


