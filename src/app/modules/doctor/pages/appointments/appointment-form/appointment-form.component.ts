import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../core/services/api.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.scss']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  chambers: any[] = [];
  availableSlots: any[] = [];
  selectedSlot: any = null;
  loadingSlots = false;
  loading = false;
  submitting = false;
  error = '';
  success = '';

  identifierTypes = ['New', 'Old', 'Lab', 'Report', 'Emergency'];
  genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];
  districts = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 
    'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur', 'Narayanganj'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.appointmentForm = this.formBuilder.group({
      chamberId: ['', Validators.required],
      appointmentSlotId: [''],
      appointmentTime: [''], // Store the selected time slot time
      phone: ['', [Validators.required, Validators.pattern(/^01[3-9]\d{8}$/)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      identifier: ['New', Validators.required],
      gender: ['', Validators.required],
      age: [0, [Validators.required, Validators.min(0), Validators.max(150)]],
      months: [0, [Validators.min(0), Validators.max(11)]],
      appointmentDate: ['', Validators.required],
      district: [''],
      upazila: [''],
      union: [''],
      fee: [0],
      refererDoctor: [''],
      refererPC: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadChambers();
    this.setDefaultDate();
    
    // Auto-fill fee based on identifier
    this.appointmentForm.get('identifier')?.valueChanges.subscribe(identifier => {
      this.updateFee(identifier);
    });

    this.appointmentForm.get('chamberId')?.valueChanges.subscribe(() => {
      this.updateFee(this.appointmentForm.get('identifier')?.value);
      this.loadAvailableSlots();
    });

    this.appointmentForm.get('appointmentDate')?.valueChanges.subscribe(() => {
      this.loadAvailableSlots();
    });

    // Search patient by phone
    this.appointmentForm.get('phone')?.valueChanges.subscribe(phone => {
      if (phone && phone.length === 11) {
        this.searchPatient(phone);
      }
    });
  }

  loadChambers(): void {
    this.loading = true;
    this.apiService.get('/chambers').subscribe({
      next: (response: any) => {
        this.chambers = response.filter((c: any) => c.isActive);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load chambers';
        this.loading = false;
      }
    });
  }

  setDefaultDate(): void {
    const today = new Date().toISOString().split('T')[0];
    this.appointmentForm.patchValue({ appointmentDate: today });
  }

  searchPatient(phone: string): void {
    this.apiService.get(`/patients/search/${phone}`).subscribe({
      next: (patients: any) => {
        if (patients && Array.isArray(patients) && patients.length > 0) {
          const patient = patients[0];
          this.appointmentForm.patchValue({
            fullName: patient.fullName,
            gender: patient.gender,
            age: patient.age,
            months: patient.months || 0,
            district: patient.district,
            upazila: patient.upazila,
            union: patient.unionName,
            identifier: patient.isNewPatient ? 'New' : 'Old'
          });
          this.success = 'Patient information loaded';
          setTimeout(() => this.success = '', 3000);
        }
      },
      error: () => {
        // Patient not found, continue with new registration
      }
    });
  }

  loadAvailableSlots(): void {
    const chamberId = this.appointmentForm.get('chamberId')?.value;
    const appointmentDate = this.appointmentForm.get('appointmentDate')?.value;

    // Reset selection
    this.selectedSlot = null;
    this.appointmentForm.patchValue({ 
      appointmentSlotId: null,
      appointmentTime: null 
    });

    if (!chamberId || !appointmentDate) {
      this.availableSlots = [];
      return;
    }

    this.loadingSlots = true;
    
    this.apiService.get(`/appointment-slots/available?chamberId=${chamberId}&date=${appointmentDate}`).subscribe({
      next: (response: any) => {
        this.availableSlots = response.filter((slot: any) => 
          slot.isActive
        ).sort((a: any, b: any) => {
          // Sort by start time
          return a.startTime.localeCompare(b.startTime);
        });
        
        // Debug: Log booked times
        console.log('Available Slots with Booked Times:', this.availableSlots.map((slot: any) => ({
          slotId: slot.id,
          startTime: slot.startTime,
          bookedTimes: slot.bookedTimes,
          bookedPatients: slot.bookedPatients
        })));
        
        this.loadingSlots = false;
      },
      error: (error) => {
        console.error('Error loading slots:', error);
        this.availableSlots = [];
        this.loadingSlots = false;
      }
    });
  }

  selectSlot(slot: any): void {
    if (this.selectedSlot?.id === slot.id) {
      // Deselect if clicking same slot
      this.selectedSlot = null;
      this.appointmentForm.patchValue({ 
        appointmentSlotId: null,
        appointmentTime: null 
      });
    } else {
      // Select new slot
      this.selectedSlot = slot;
      this.appointmentForm.patchValue({ 
        appointmentSlotId: slot.id,
        appointmentTime: slot.startTime // Use slot's start time as default
      });
    }
  }

  getSlotTimeDisplay(slot: any): string {
    const startTime = this.formatTime(slot.startTime);
    return startTime;
  }

  formatTime(timeString: string): string {
    // Convert 24-hour to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${minutes} ${period}`;
  }

  generateTimeSlots(slot: any): any[] {
    const timeSlots: any[] = [];
    const start = this.parseTimeToMinutes(slot.startTime);
    const end = this.parseTimeToMinutes(slot.endTime);
    
    // Get chamber to find waiting time interval
    const chamber = this.chambers.find(c => c.id === +this.appointmentForm.get('chamberId')?.value);
    const interval = chamber?.waitingTimeVisit || 15; // Default 15 minutes
    
    const totalSlots = Math.floor((end - start) / interval);
    
    // Get booked times for this slot (from backend response)
    const bookedTimes = slot.bookedTimes || [];
    console.log(`Generating time slots for slot ${slot.id}:`, {
      slotId: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      bookedTimes: bookedTimes,
      interval: interval
    });
    
    for (let i = 0; i < totalSlots; i++) {
      const timeInMinutes = start + (i * interval);
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      // Check if this specific time is booked
      // Normalize both times for comparison (handle different formats)
      const normalizedTimeString = timeString; // Already in HH:mm:ss format
      const isBooked = bookedTimes.some((bookedTime: string) => {
        // Normalize booked time to HH:mm:ss format
        let normalizedBookedTime = bookedTime ? bookedTime.trim() : '';
        if (normalizedBookedTime.length === 5) {
          normalizedBookedTime = normalizedBookedTime + ':00';
        }
        const matches = normalizedBookedTime === normalizedTimeString;
        if (matches) {
          console.log(`Time slot ${timeString} is BOOKED (matched with ${normalizedBookedTime})`);
        }
        return matches;
      });
      
      timeSlots.push({
        time: timeString,
        parentSlotId: slot.id,
        slotIndex: i,
        isBooked: isBooked, // Check actual booked times from backend
        isActive: slot.isActive
      });
    }
    
    console.log(`Generated ${timeSlots.length} time slots, ${timeSlots.filter(ts => ts.isBooked).length} booked`);
    
    return timeSlots;
  }

  parseTimeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  selectTimeSlot(timeSlot: any, parentSlot: any): void {
    if (timeSlot.isBooked || !timeSlot.isActive) {
      return; // Can't select booked or inactive slots
    }
    
    if (this.selectedSlot?.time === timeSlot.time && this.selectedSlot?.parentSlotId === timeSlot.parentSlotId) {
      // Deselect
      this.selectedSlot = null;
      this.appointmentForm.patchValue({ 
        appointmentSlotId: null,
        appointmentTime: null 
      });
    } else {
      // Select - store both parent slot ID and the specific time
      this.selectedSlot = timeSlot;
      this.appointmentForm.patchValue({ 
        appointmentSlotId: parentSlot.id,
        appointmentTime: timeSlot.time // Store the specific time slot time (e.g., "23:48:00")
      });
    }
  }

  getTimeSlotButtonClass(timeSlot: any): string {
    const isSelected = this.selectedSlot?.time === timeSlot.time && 
                      this.selectedSlot?.parentSlotId === timeSlot.parentSlotId;
    
    if (!timeSlot.isActive) {
      return 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60';
    }
    
    // Booked slots - red background, disabled
    if (timeSlot.isBooked) {
      return 'bg-red-500 text-white cursor-not-allowed opacity-80 border-2 border-red-600';
    }
    
    if (isSelected) {
      return 'bg-blue-600 text-white border-2 border-blue-700 ring-2 ring-blue-300';
    }
    
    return 'bg-green-600 text-white hover:bg-green-700 cursor-pointer';
  }

  getSlotButtonClass(slot: any): string {
    const isSelected = this.selectedSlot?.id === slot.id;
    const available = slot.maxPatients - slot.bookedPatients;
    const isFull = available === 0;
    const isAlmostFull = available <= 5 && available > 0;

    if (isSelected) {
      return 'bg-sakura text-white border-2 border-sakura';
    }
    
    if (isFull) {
      return 'bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed';
    }
    
    if (isAlmostFull) {
      return 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100';
    }
    
    return 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100';
  }

  updateFee(identifier: string): void {
    const chamberId = this.appointmentForm.get('chamberId')?.value;
    if (!chamberId) return;

    const chamber = this.chambers.find(c => c.id === +chamberId);
    if (chamber) {
      const fee = identifier === 'New' ? chamber.feeFirstTime : chamber.feeFollowup;
      this.appointmentForm.patchValue({ fee });
    }
  }

  get f() {
    return this.appointmentForm.controls;
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      Object.keys(this.appointmentForm.controls).forEach(key => {
        this.appointmentForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    // Prepare form data - ensure appointmentTime is included if time slot is selected
    const formData = { ...this.appointmentForm.value };
    
    // If a time slot is selected, ensure appointmentTime is set
    if (this.selectedSlot && this.selectedSlot.time && !formData.appointmentTime) {
      formData.appointmentTime = this.selectedSlot.time;
    }
    
    // Debug: Log form data before submission
    console.log('Appointment Form Data:', {
      appointmentSlotId: formData.appointmentSlotId,
      appointmentTime: formData.appointmentTime,
      selectedSlot: this.selectedSlot,
      selectedSlotTime: this.selectedSlot?.time,
      fullFormData: formData
    });

    this.apiService.post('/appointments', formData).subscribe({
      next: (response: any) => {
        this.success = `Appointment booked successfully! Serial Number: ${response.serialNumber}`;
        this.submitting = false;
        
        // Reset form after 2 seconds
        setTimeout(() => {
          this.appointmentForm.reset();
          this.setDefaultDate();
          this.appointmentForm.patchValue({ identifier: 'New' });
        }, 2000);
      },
      error: (error) => {
        this.error = error.error?.message || 'Failed to book appointment';
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
