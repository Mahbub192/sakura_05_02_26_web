import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-assistant-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit {
  form: FormGroup;
  chambers: any[] = [];
  availableSlots: any[] = [];
  selectedSlot: any = null;
  loadingSlots = false;
  loading = false;
  submitting = false;
  error = '';
  success = '';
  foundPatients: any[] = [];
  selectedPatient: any = null;
  searchingPatient = false;

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
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.form = this.fb.group({
      chamberId: ['', Validators.required],
      appointmentSlotId: [''],
      appointmentTime: [''],
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

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loadChambers();
    this.setDefaultDate();
    this.form.get('identifier')?.valueChanges.subscribe(id => this.updateFee(id));
    this.form.get('chamberId')?.valueChanges.subscribe(() => {
      this.updateFee(this.form.get('identifier')?.value);
      this.loadAvailableSlots();
    });
    this.form.get('appointmentDate')?.valueChanges.subscribe(() => this.loadAvailableSlots());

    let phoneChangeTimeout: any;
    this.form.get('phone')?.valueChanges.subscribe(phone => {
      if (phoneChangeTimeout) clearTimeout(phoneChangeTimeout);
      this.selectedPatient = null;
      this.foundPatients = [];
      phoneChangeTimeout = setTimeout(() => {
        if (phone && phone.length === 11 && /^01[3-9]\d{8}$/.test(phone)) {
          this.searchPatient(phone);
        } else if (phone && phone.length === 11) {
          this.clearPatientInfo();
        } else if (!phone || phone.length === 0) {
          this.clearPatientInfo();
        }
      }, 300);
    });
  }

  loadChambers(): void {
    this.loading = true;
    this.apiService.get('/chambers').subscribe({
      next: (res: any) => {
        this.chambers = Array.isArray(res) ? res.filter((c: any) => c.isActive) : [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load chambers.';
        this.loading = false;
      }
    });
  }

  setDefaultDate(): void {
    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({ appointmentDate: today });
  }

  searchPatient(phone: string): void {
    if (this.form.get('phone')?.value !== phone) return;
    this.searchingPatient = true;
    this.apiService.get(`/patients/by-phone/${phone}`).subscribe({
      next: (patients: any) => {
        this.searchingPatient = false;
        if (this.form.get('phone')?.value !== phone) return;
        if (patients && Array.isArray(patients) && patients.length > 0) {
          this.foundPatients = patients;
          if (patients.length === 1) {
            this.selectPatient(patients[0]);
          } else {
            this.selectedPatient = null;
          }
        } else {
          this.foundPatients = [];
          this.selectedPatient = null;
          this.clearPatientInfo();
        }
      },
      error: () => {
        this.searchingPatient = false;
        this.foundPatients = [];
        this.selectedPatient = null;
        this.clearPatientInfo();
      }
    });
  }

  selectPatient(patient: any): void {
    this.selectedPatient = patient;
    const currentId = this.form.get('identifier')?.value || 'New';
    this.form.patchValue({
      fullName: patient.fullName || '',
      gender: patient.gender || '',
      age: patient.age || 0,
      months: patient.months || 0,
      district: patient.district || '',
      upazila: patient.upazila || '',
      union: patient.unionName || '',
      identifier: currentId || (patient.isNewPatient ? 'New' : 'Old')
    }, { emitEvent: false });
    this.success = 'Patient information loaded';
    setTimeout(() => this.success = '', 3000);
  }

  clearPatientInfo(): void {
    const phone = this.form.get('phone')?.value;
    const currentId = this.form.get('identifier')?.value || 'New';
    this.form.patchValue({
      fullName: '',
      gender: '',
      age: 0,
      months: 0,
      district: '',
      upazila: '',
      union: '',
      identifier: currentId
    }, { emitEvent: false });
    if (phone) this.form.patchValue({ phone }, { emitEvent: false });
  }

  createNewPatient(): void {
    this.selectedPatient = null;
    this.clearPatientInfo();
  }

  loadAvailableSlots(): void {
    const chamberId = this.form.get('chamberId')?.value;
    const appointmentDate = this.form.get('appointmentDate')?.value;
    this.selectedSlot = null;
    this.form.patchValue({ appointmentSlotId: null, appointmentTime: null });
    if (!chamberId || !appointmentDate) {
      this.availableSlots = [];
      return;
    }
    this.loadingSlots = true;
    this.apiService.get(`/appointment-slots/available?chamberId=${chamberId}&date=${appointmentDate}`).subscribe({
      next: (res: any) => {
        this.availableSlots = (Array.isArray(res) ? res : [])
          .filter((s: any) => s.isActive)
          .sort((a: any, b: any) => (a.startTime || '').localeCompare(b.startTime || ''));
        this.loadingSlots = false;
      },
      error: () => {
        this.availableSlots = [];
        this.loadingSlots = false;
      }
    });
  }

  parseTimeToMinutes(timeString: string): number {
    const parts = timeString.split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }

  generateTimeSlots(slot: any): any[] {
    const timeSlots: any[] = [];
    const start = this.parseTimeToMinutes(slot.startTime);
    const end = this.parseTimeToMinutes(slot.endTime);
    const chamber = this.chambers.find(c => c.id === +this.form.get('chamberId')?.value);
    const interval = chamber?.waitingTimeVisit || 15;
    const totalSlots = Math.floor((end - start) / interval);
    const bookedTimes = slot.bookedTimes || [];
    for (let i = 0; i < totalSlots; i++) {
      const timeInMinutes = start + (i * interval);
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      let normBooked = (t: string) => (t || '').trim().length === 5 ? (t || '').trim() + ':00' : (t || '').trim();
      const isBooked = bookedTimes.some((bt: string) => normBooked(bt) === timeString);
      timeSlots.push({
        time: timeString,
        parentSlotId: slot.id,
        slotIndex: i,
        isBooked,
        isActive: slot.isActive
      });
    }
    return timeSlots;
  }

  selectTimeSlot(timeSlot: any, parentSlot: any): void {
    if (timeSlot.isBooked || !timeSlot.isActive) return;
    if (this.selectedSlot?.time === timeSlot.time && this.selectedSlot?.parentSlotId === timeSlot.parentSlotId) {
      this.selectedSlot = null;
      this.form.patchValue({ appointmentSlotId: null, appointmentTime: null });
    } else {
      this.selectedSlot = timeSlot;
      this.form.patchValue({
        appointmentSlotId: parentSlot.id,
        appointmentTime: timeSlot.time
      });
    }
  }

  getTimeSlotButtonClass(timeSlot: any): string {
    const isSelected = this.selectedSlot?.time === timeSlot.time && this.selectedSlot?.parentSlotId === timeSlot.parentSlotId;
    if (!timeSlot.isActive) return 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60';
    if (timeSlot.isBooked) return 'bg-red-500 text-white cursor-not-allowed opacity-80 border-2 border-red-600';
    if (isSelected) return 'bg-dark-green text-white border-2 border-dark-green ring-2 ring-accent-green/40';
    return 'bg-accent-green text-dark-green hover:opacity-90 cursor-pointer border border-accent-green/30';
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = (timeString || '').split(':');
    const hour = parseInt(hours || '0', 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${displayHour}:${(minutes || '00').padStart(2, '0')} ${period}`;
  }

  updateFee(identifier: string): void {
    const chamberId = this.form.get('chamberId')?.value;
    if (!chamberId) return;
    const chamber = this.chambers.find(c => c.id === +chamberId);
    if (chamber) {
      const fee = identifier === 'New' ? chamber.feeFirstTime : chamber.feeFollowup;
      this.form.patchValue({ fee: fee ?? 0 });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(k => this.form.get(k)?.markAsTouched());
      return;
    }
    this.submitting = true;
    this.error = '';
    this.success = '';
    const formData = { ...this.form.value };
    if (!formData.identifier) formData.identifier = 'New';
    if (this.selectedSlot?.time && !formData.appointmentTime) formData.appointmentTime = this.selectedSlot.time;
    this.apiService.post('/appointments', formData).subscribe({
      next: (response: any) => {
        this.success = response.serialNumber
          ? `Appointment booked successfully! Serial Number: ${response.serialNumber}`
          : 'Appointment booked successfully!';
        this.submitting = false;
        setTimeout(() => {
          this.form.reset();
          this.setDefaultDate();
          this.form.patchValue({ identifier: 'New', age: 0, months: 0, fee: 0 });
          this.selectedSlot = null;
          this.selectedPatient = null;
          this.foundPatients = [];
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to book appointment.';
        this.submitting = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/assistant/dashboard']);
  }
}
