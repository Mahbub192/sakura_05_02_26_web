import { Component } from '@angular/core';

interface Medication {
  name: string;
  instruction: string;
  icon: 'pill' | 'medication';
}

interface Prescription {
  id: string;
  doctorName: string;
  role: string;
  date: string;
  status: 'active' | 'completed' | 'expired';
  medications: Medication[];
  pharmacy?: string;
  showPharmacy: boolean;
}

@Component({
  selector: 'app-doctor-prescriptions',
  templateUrl: './doctor-prescriptions.component.html',
  styleUrls: ['./doctor-prescriptions.component.scss'],
})
export class DoctorPrescriptionsComponent {
  searchQuery = '';
  prescriptions: Prescription[] = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Smith',
      role: 'ENT Specialist',
      date: 'Oct 12, 2023',
      status: 'active',
      medications: [
        { name: 'Amoxicillin (500mg)', instruction: 'Take 1 capsule every 8 hours for 7 days. Finish the entire course.', icon: 'pill' },
        { name: 'Fluticasone Nasal Spray', instruction: '2 sprays in each nostril once daily. Shake well before use.', icon: 'medication' },
      ],
      pharmacy: 'CVS Pharmacy #4920, Main St.',
      showPharmacy: true,
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      role: 'Otolaryngologist',
      date: 'Aug 28, 2023',
      status: 'completed',
      medications: [
        { name: 'Claritin-D 24 Hour', instruction: '1 tablet daily as needed for seasonal allergies.', icon: 'pill' },
      ],
      pharmacy: 'Walgreens #1102, Oak Ave.',
      showPharmacy: true,
    },
    {
      id: '3',
      doctorName: 'Dr. Sarah Smith',
      role: 'ENT Specialist',
      date: 'June 15, 2023',
      status: 'expired',
      medications: [
        { name: 'Ciprofloxacin Drops', instruction: '3 drops in right ear twice daily for 5 days.', icon: 'medication' },
      ],
      showPharmacy: false,
    },
  ];

  requestRefill(): void {
    // Placeholder – wire to API later
  }

  downloadPdf(id: string): void {
    // Placeholder
  }

  printPrescription(id: string): void {
    window.print();
  }
}
