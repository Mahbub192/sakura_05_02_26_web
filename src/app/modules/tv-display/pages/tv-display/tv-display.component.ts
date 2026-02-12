import { Component, OnInit } from '@angular/core';

interface DisplayPatient {
  serialNumber: number;
  patientId: string;
  status: string;
  estimatedWaitTime: string;
}

@Component({
  selector: 'app-tv-display',
  templateUrl: './tv-display.component.html',
  styleUrls: ['./tv-display.component.scss']
})
export class TvDisplayComponent implements OnInit {
  patients: DisplayPatient[] = [];
  doctorName = 'Dr. Abdul Rahman';
  doctorQualification = 'MBBS, FCPS (Medicine)';
  doctorSpecialization = 'Medicine Specialist';
  chamberName = 'Main Chamber - Dhaka';
  currentDate = new Date();
  breakNotes = '';
  showBreakNotice = false;
  youtubeVideoId = 'dQw4w9WgXcQ'; // Example video ID

  constructor() { }

  ngOnInit(): void {
    this.loadPatients();
    this.startAutoRefresh();
  }

  loadPatients(): void {
    // Mock data - Replace with actual WebSocket or API polling
    this.patients = [
      { serialNumber: 1, patientId: 'P1001', status: 'Running', estimatedWaitTime: 'Now' },
      { serialNumber: 2, patientId: 'P1002', status: 'Next', estimatedWaitTime: '5 min' },
      { serialNumber: 3, patientId: 'P1003', status: 'Waiting', estimatedWaitTime: '15 min' },
      { serialNumber: 4, patientId: 'P1004', status: 'Absent', estimatedWaitTime: '-' },
      { serialNumber: 5, patientId: 'P1005', status: 'Waiting', estimatedWaitTime: '25 min' }
    ];
  }

  startAutoRefresh(): void {
    // Refresh every 10 seconds
    setInterval(() => {
      this.loadPatients();
      this.currentDate = new Date();
    }, 10000);
  }
}


