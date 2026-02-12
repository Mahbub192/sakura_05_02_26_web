import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  currentStep: number = 1;
  loading = false;
  chambers: any[] = [];
  selectedChamber: any = null;
  availableSlots: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      chamberId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      timeSlot: [''],
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^01[3-9]\d{8}$/)]],
      age: [0, [Validators.required, Validators.min(0)]],
      gender: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadChambers();
  }

  loadChambers(): void {
    // Mock data
    this.chambers = [
      { id: 1, name: 'Main Chamber - Dhaka', fee: 500, availableDays: ['Sunday', 'Monday', 'Wednesday'] },
      { id: 2, name: 'Branch Chamber - Chittagong', fee: 400, availableDays: ['Tuesday', 'Thursday'] }
    ];
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      alert('Appointment booked successfully! Your token number will be sent via SMS.');
      this.router.navigate(['/']);
    }, 1000);
  }
}


