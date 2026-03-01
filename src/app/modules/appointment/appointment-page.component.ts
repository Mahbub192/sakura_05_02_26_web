import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-appointment-page',
  templateUrl: './appointment-page.component.html',
  styleUrls: ['./appointment-page.component.scss'],
})
export class AppointmentPageComponent implements OnInit {
  appointmentForm: FormGroup;
  doctors: any[] = [];
  chambers: any[] = [];
  availableSlots: any[] = [];
  selectedSlot: any = null;
  loadingDoctors = false;
  loadingSlots = false;
  loading = false;
  submitting = false;
  error = '';
  success = '';
  /** Booking success: show confirmation modal with serial number */
  showSuccessModal = false;
  successSerialNumber: string | null = null;
  /** Booking error: show error modal */
  showErrorModal = false;
  foundPatients: any[] = [];
  selectedPatient: any = null;
  searchingPatient = false;

  /** Which custom dropdown is open: 'doctor' | 'chamber' | 'type' | 'gender' | 'district' | '' */
  openDropdown: '' | 'doctor' | 'chamber' | 'type' | 'gender' | 'district' = '';

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-dropdown')) {
      this.openDropdown = '';
    }
  }

  identifierTypes = ['New', 'Old', 'Lab', 'Report', 'Emergency'];
  genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];
  districts = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet',
    'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur', 'Narayanganj',
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.appointmentForm = this.formBuilder.group({
      doctorId: ['', Validators.required],
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
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadDoctors();
    this.setDefaultDate();

    this.appointmentForm.get('identifier')?.valueChanges.subscribe((id) => this.updateFee(id));
    this.appointmentForm.get('doctorId')?.valueChanges.subscribe((doctorId) => {
      this.appointmentForm.patchValue({ chamberId: '' }, { emitEvent: false });
      this.availableSlots = [];
      this.selectedSlot = null;
      this.loadChambers();
    });
    this.appointmentForm.get('chamberId')?.valueChanges.subscribe(() => {
      this.updateFee(this.appointmentForm.get('identifier')?.value);
      this.loadAvailableSlots();
    });
    this.appointmentForm.get('appointmentDate')?.valueChanges.subscribe(() => this.loadAvailableSlots());

    let phoneChangeTimeout: any;
    this.appointmentForm.get('phone')?.valueChanges.subscribe((phone) => {
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

  loadDoctors(): void {
    this.loadingDoctors = true;
    this.apiService.get('/public/doctors').subscribe({
      next: (response: any) => {
        this.doctors = Array.isArray(response) ? response : [];
        this.loadingDoctors = false;
      },
      error: () => {
        this.error = 'Failed to load doctors';
        this.loadingDoctors = false;
      },
    });
  }

  loadChambers(): void {
    const doctorId = this.appointmentForm.get('doctorId')?.value;
    if (!doctorId) {
      this.chambers = [];
      this.loading = false;
      return;
    }
    this.loading = true;
    this.apiService.get(`/public/chambers?doctorId=${doctorId}`).subscribe({
      next: (response: any) => {
        this.chambers = (response || []).filter((c: any) => c.isActive !== false);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load chambers';
        this.loading = false;
      },
    });
  }

  setDefaultDate(): void {
    const today = new Date().toISOString().split('T')[0];
    this.appointmentForm.patchValue({ appointmentDate: today });
  }

  searchPatient(phone: string): void {
    if (this.appointmentForm.get('phone')?.value !== phone) return;
    this.searchingPatient = true;
    this.apiService.get(`/public/patients/by-phone/${phone}`).subscribe({
      next: (patients: any) => {
        this.searchingPatient = false;
        if (this.appointmentForm.get('phone')?.value !== phone) return;
        if (patients && Array.isArray(patients) && patients.length > 0) {
          this.foundPatients = patients;
          if (patients.length === 1) this.selectPatient(patients[0]);
          else this.selectedPatient = null;
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
      },
    });
  }

  selectPatient(patient: any): void {
    this.selectedPatient = patient;
    const currentIdentifier = this.appointmentForm.get('identifier')?.value || 'New';
    this.appointmentForm.patchValue(
      {
        fullName: patient.fullName || '',
        gender: patient.gender || '',
        age: patient.age || 0,
        months: patient.months || 0,
        district: patient.district || '',
        upazila: patient.upazila || '',
        union: patient.unionName || '',
        identifier: currentIdentifier || (patient.isNewPatient ? 'New' : 'Old'),
      },
      { emitEvent: false }
    );
    this.success = 'Patient information loaded';
    setTimeout(() => (this.success = ''), 3000);
  }

  clearPatientInfo(): void {
    const phone = this.appointmentForm.get('phone')?.value;
    const currentIdentifier = this.appointmentForm.get('identifier')?.value || 'New';
    this.appointmentForm.patchValue(
      {
        fullName: '',
        gender: '',
        age: 0,
        months: 0,
        district: '',
        upazila: '',
        union: '',
        identifier: currentIdentifier,
      },
      { emitEvent: false }
    );
    if (phone) this.appointmentForm.patchValue({ phone }, { emitEvent: false });
  }

  createNewPatient(): void {
    this.selectedPatient = null;
    this.clearPatientInfo();
  }

  loadAvailableSlots(): void {
    const chamberId = this.appointmentForm.get('chamberId')?.value;
    const appointmentDate = this.appointmentForm.get('appointmentDate')?.value;
    this.selectedSlot = null;
    this.appointmentForm.patchValue({ appointmentSlotId: null, appointmentTime: null });
    if (!chamberId || !appointmentDate) {
      this.availableSlots = [];
      return;
    }
    this.loadingSlots = true;
    this.apiService
      .get(`/public/appointment-slots/available?chamberId=${chamberId}&date=${appointmentDate}`)
      .subscribe({
        next: (response: any) => {
          this.availableSlots = (response || [])
            .filter((s: any) => s.isActive)
            .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
          this.loadingSlots = false;
        },
        error: () => {
          this.availableSlots = [];
          this.loadingSlots = false;
        },
      });
  }

  selectTimeSlot(timeSlot: any, parentSlot: any): void {
    if (timeSlot.isBooked || !timeSlot.isActive) return;
    if (
      this.selectedSlot?.time === timeSlot.time &&
      this.selectedSlot?.parentSlotId === timeSlot.parentSlotId
    ) {
      this.selectedSlot = null;
      this.appointmentForm.patchValue({ appointmentSlotId: null, appointmentTime: null });
    } else {
      this.selectedSlot = timeSlot;
      this.appointmentForm.patchValue({
        appointmentSlotId: parentSlot.id,
        appointmentTime: timeSlot.time,
      });
    }
  }

  generateTimeSlots(slot: any): any[] {
    const timeSlots: any[] = [];
    const start = this.parseTimeToMinutes(slot.startTime);
    const end = this.parseTimeToMinutes(slot.endTime);
    const chamber = this.chambers.find((c) => c.id === +this.appointmentForm.get('chamberId')?.value);
    const interval = chamber?.waitingTimeVisit || 15;
    const totalSlots = Math.floor((end - start) / interval);
    const bookedTimes = slot.bookedTimes || [];
    for (let i = 0; i < totalSlots; i++) {
      const timeInMinutes = start + i * interval;
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      const normalizedTimeString = timeString;
      const isBooked = bookedTimes.some((bookedTime: string) => {
        let normalizedBookedTime = (bookedTime || '').trim();
        if (normalizedBookedTime.length === 5) normalizedBookedTime += ':00';
        return normalizedBookedTime === normalizedTimeString;
      });
      timeSlots.push({
        time: timeString,
        parentSlotId: slot.id,
        slotIndex: i,
        isBooked,
        isActive: slot.isActive,
      });
    }
    return timeSlots;
  }

  parseTimeToMinutes(timeString: string): number {
    const parts = timeString.split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }

  formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  }

  getTimeSlotButtonClass(timeSlot: any): string {
    const isSelected =
      this.selectedSlot?.time === timeSlot.time &&
      this.selectedSlot?.parentSlotId === timeSlot.parentSlotId;
    if (!timeSlot.isActive)
      return 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60';
    if (timeSlot.isBooked)
      return 'bg-red-500 text-white cursor-not-allowed opacity-80 border-2 border-red-600';
    if (isSelected)
      return 'bg-dark-green text-white border-2 border-dark-green ring-2 ring-accent-green';
    return 'bg-accent-green text-dark-green hover:bg-accent-green/90 cursor-pointer border border-dark-green/20';
  }

  updateFee(identifier: string): void {
    const chamberId = this.appointmentForm.get('chamberId')?.value;
    if (!chamberId) return;
    const chamber = this.chambers.find((c) => c.id === +chamberId);
    if (chamber) {
      const fee = identifier === 'New' ? chamber.feeFirstTime : chamber.feeFollowup;
      this.appointmentForm.patchValue({ fee });
    }
  }

  toggleDropdown(key: '' | 'doctor' | 'chamber' | 'type' | 'gender' | 'district'): void {
    this.openDropdown = this.openDropdown === key ? '' : key;
  }

  selectDoctor(id: string | number): void {
    const value = id === '' || id == null ? '' : String(id);
    this.appointmentForm.patchValue({ doctorId: value });
    this.openDropdown = '';
  }

  selectChamber(id: string | number): void {
    this.appointmentForm.patchValue({ chamberId: id === '' ? '' : String(id) });
    this.openDropdown = '';
  }

  selectType(value: string): void {
    this.appointmentForm.patchValue({ identifier: value });
    this.openDropdown = '';
  }

  selectGender(value: string): void {
    this.appointmentForm.patchValue({ gender: value });
    this.openDropdown = '';
  }

  selectDistrict(value: string): void {
    this.appointmentForm.patchValue({ district: value });
    this.openDropdown = '';
  }

  getChamberLabel(): string {
    const id = this.appointmentForm.get('chamberId')?.value;
    if (!id) return 'Select Chamber';
    const c = this.chambers.find((ch) => String(ch.id) === String(id));
    return c ? `${c.name} - ${c.appointmentNumber}` : 'Select Chamber';
  }

  getDoctorLabel(): string {
    const id = this.appointmentForm.get('doctorId')?.value;
    if (!id) return 'Select Doctor';
    const d = this.doctors.find((doc: any) => String(doc.id) === String(id));
    return d ? d.fullName : 'Select Doctor';
  }

  getTypeLabel(): string {
    return this.appointmentForm.get('identifier')?.value || 'Select Type';
  }

  getGenderLabel(): string {
    const v = this.appointmentForm.get('gender')?.value;
    return this.genders.find((g) => g.value === v)?.label || 'Select Gender';
  }

  getDistrictLabel(): string {
    return this.appointmentForm.get('district')?.value || 'Select District';
  }

  get f() {
    return this.appointmentForm.controls;
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      Object.keys(this.appointmentForm.controls).forEach((key) =>
        this.appointmentForm.get(key)?.markAsTouched()
      );
      return;
    }
    this.submitting = true;
    this.error = '';
    this.success = '';
    const formData = { ...this.appointmentForm.value };
    if (!formData.identifier) formData.identifier = 'New';
    if (this.selectedSlot?.time && !formData.appointmentTime) {
      formData.appointmentTime = this.selectedSlot.time;
    }
    this.apiService.post('/public/appointments', formData).subscribe({
      next: (response: any) => {
        this.successSerialNumber = response?.serialNumber ?? null;
        this.showSuccessModal = true;
        this.submitting = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to book appointment';
        this.showErrorModal = true;
        this.submitting = false;
      },
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.successSerialNumber = null;
    this.appointmentForm.reset();
    this.setDefaultDate();
    this.appointmentForm.patchValue({ identifier: 'New' });
    this.selectedPatient = null;
    this.foundPatients = [];
    this.selectedSlot = null;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.error = '';
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
