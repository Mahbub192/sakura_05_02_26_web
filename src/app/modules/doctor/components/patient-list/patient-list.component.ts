import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Patient {
  id: number;
  fullName: string;
  patientId: string;
  phone: string;
  status: string;
  isPresent: boolean;
  serialNumber: number;
  identifier?: string;
  fee?: number;
}

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent {
  @Input() patients: Patient[] = [];
  @Output() patientUpdate = new EventEmitter<Patient>();

  selectedPatient: Patient | null = null;
  showEditModal = false;
  showReportModal = false;
  showFeeModal = false;

  togglePresence(patient: Patient): void {
    patient.isPresent = !patient.isPresent;
    if (!patient.isPresent && patient.status === 'serialized') {
      patient.status = 'absent';
    } else if (patient.isPresent && patient.status === 'absent') {
      patient.status = 'serialized';
    }
    this.patientUpdate.emit(patient);
  }

  editPatient(patient: Patient): void {
    this.selectedPatient = { ...patient };
    this.showEditModal = true;
  }

  viewReport(patient: Patient): void {
    this.selectedPatient = patient;
    this.showReportModal = true;
  }

  manageFee(patient: Patient): void {
    this.selectedPatient = patient;
    this.showFeeModal = true;
  }

  printToken(patient: Patient): void {
    // Implement token printing logic
    console.log('Printing token for:', patient.fullName);
  }

  printBill(patient: Patient): void {
    // Implement bill printing logic
    console.log('Printing bill for:', patient.fullName);
  }

  skipPatient(patient: Patient): void {
    if (patient.status === 'running') {
      patient.status = 'serialized';
      this.patientUpdate.emit(patient);
    }
  }

  closeModals(): void {
    this.showEditModal = false;
    this.showReportModal = false;
    this.showFeeModal = false;
    this.selectedPatient = null;
  }
}


