import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface AssistantPatient {
  id: number;
  serialNumber: number;
  patientName: string;
  patientId: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  patients: AssistantPatient[] = [];
  loading = false;
  showBookingModal = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    setTimeout(() => {
      this.patients = [
        { id: 1, serialNumber: 4, patientName: 'তুলি', patientId: '101130', status: 'Absent' },
        { id: 2, serialNumber: 5, patientName: 'hello', patientId: '126700', status: 'Absent' }
      ];
      this.loading = false;
    }, 500);
  }

  openBookingModal(): void {
    this.showBookingModal = true;
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
  }

  managePatient(patient: AssistantPatient): void {
    // Handle patient management
    console.log('Managing patient:', patient);
  }
}


