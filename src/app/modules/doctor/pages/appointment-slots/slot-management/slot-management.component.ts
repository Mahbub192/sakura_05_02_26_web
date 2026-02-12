import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../../../core/services/api.service';

@Component({
  selector: 'app-slot-management',
  templateUrl: './slot-management.component.html',
  styleUrls: ['./slot-management.component.scss']
})
export class SlotManagementComponent implements OnInit {
  slotForm: FormGroup;
  slots: any[] = [];
  chambers: any[] = [];
  loading = false;
  submitting = false;
  error = '';
  success = '';
  selectedDate: string = '';
  selectedChamberId: number | null = null;
  showForm = false;
  editingSlot: any = null;
  statistics: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {
    this.slotForm = this.formBuilder.group({
      chamberId: ['', Validators.required],
      slotDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      maxPatients: [20, [Validators.required, Validators.min(1), Validators.max(100)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadChambers();
    this.setDefaultDate();
  }

  loadChambers(): void {
    this.loading = true;
    this.apiService.get('/chambers').subscribe({
      next: (response: any) => {
        this.chambers = response.filter((c: any) => c.isActive);
        if (this.chambers.length > 0) {
          this.selectedChamberId = this.chambers[0].id;
          this.slotForm.patchValue({ chamberId: this.chambers[0].id });
          this.loadSlots();
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load chambers';
        this.loading = false;
      }
    });
  }

  setDefaultDate(): void {
    const today = new Date().toISOString().split('T')[0];
    this.selectedDate = today;
    this.slotForm.patchValue({ slotDate: today });
  }

  onChamberChange(event: any): void {
    this.selectedChamberId = +event.target.value;
    this.loadSlots();
    this.loadStatistics();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.loadSlots();
    this.loadStatistics();
  }

  loadSlots(): void {
    if (!this.selectedChamberId) return;

    this.loading = true;
    const params = new URLSearchParams({
      chamberId: this.selectedChamberId.toString(),
      date: this.selectedDate
    });

    this.apiService.get(`/appointment-slots?${params.toString()}`).subscribe({
      next: (response: any) => {
        this.slots = response;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load slots';
        this.loading = false;
      }
    });
  }

  loadStatistics(): void {
    if (!this.selectedChamberId || !this.selectedDate) return;

    const params = new URLSearchParams({
      chamberId: this.selectedChamberId.toString(),
      date: this.selectedDate
    });

    this.apiService.get(`/appointment-slots/statistics?${params.toString()}`).subscribe({
      next: (response: any) => {
        this.statistics = response;
      },
      error: () => {}
    });
  }

  get f() {
    return this.slotForm.controls;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.editingSlot = null;
    this.slotForm.reset();
    this.setDefaultDate();
    if (this.selectedChamberId) {
      this.slotForm.patchValue({ chamberId: this.selectedChamberId });
    }
  }

  editSlot(slot: any): void {
    this.editingSlot = slot;
    this.showForm = true;
    this.slotForm.patchValue({
      chamberId: slot.chamberId,
      slotDate: new Date(slot.slotDate).toISOString().split('T')[0],
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxPatients: slot.maxPatients,
      notes: slot.notes || ''
    });
  }

  onSubmit(): void {
    if (this.slotForm.invalid) {
      Object.keys(this.slotForm.controls).forEach(key => {
        this.slotForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const endpoint = this.editingSlot 
      ? `/appointment-slots/${this.editingSlot.id}`
      : '/appointment-slots';
    
    const method = this.editingSlot ? 'put' : 'post';

    this.apiService[method](endpoint, this.slotForm.value).subscribe({
      next: () => {
        this.success = this.editingSlot 
          ? 'Slot updated successfully!' 
          : 'Slot created successfully!';
        this.submitting = false;
        this.showForm = false;
        this.resetForm();
        this.loadSlots();
        this.loadStatistics();
        setTimeout(() => this.success = '', 3000);
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to save slot';
        this.submitting = false;
      }
    });
  }

  toggleSlotStatus(slot: any): void {
    this.apiService.put(`/appointment-slots/${slot.id}/toggle-status`, {}).subscribe({
      next: () => {
        this.success = `Slot ${slot.isActive ? 'disabled' : 'enabled'} successfully!`;
        this.loadSlots();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => {
        this.error = 'Failed to update slot status';
      }
    });
  }

  deleteSlot(slot: any): void {
    if (!confirm(`Are you sure you want to delete this slot (${slot.startTime} - ${slot.endTime})?`)) {
      return;
    }

    this.apiService.delete(`/appointment-slots/${slot.id}`).subscribe({
      next: () => {
        this.success = 'Slot deleted successfully!';
        this.loadSlots();
        this.loadStatistics();
        setTimeout(() => this.success = '', 3000);
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to delete slot';
      }
    });
  }

  getUtilizationColor(percentage: number): string {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  }

  viewMode: 'buttons' | 'table' = 'buttons';
  selectedSlotView: any = null;

  getSlotStatusClass(slot: any): string {
    if (!slot.isActive) return 'bg-gray-100';
    if (slot.bookedPatients >= slot.maxPatients) return 'bg-red-50';
    if (slot.bookedPatients >= slot.maxPatients * 0.8) return 'bg-yellow-50';
    return 'bg-green-50';
  }

  selectSlotForView(slot: any): void {
    if (this.selectedSlotView?.id === slot.id) {
      this.selectedSlotView = null;
    } else {
      this.selectedSlotView = slot;
    }
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
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
    const chamber = this.chambers.find(c => c.id === slot.chamberId);
    const interval = chamber?.waitingTimeVisit || 15; // Default 15 minutes
    
    const patientsPerSlot = 1; // Each time slot = 1 patient
    const totalSlots = Math.floor((end - start) / interval);
    
    for (let i = 0; i < totalSlots; i++) {
      const timeInMinutes = start + (i * interval);
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = timeInMinutes % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      timeSlots.push({
        time: timeString,
        parentSlotId: slot.id,
        isBooked: i < slot.bookedPatients, // First N slots are booked
        isActive: slot.isActive
      });
    }
    
    return timeSlots;
  }

  parseTimeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getTimeSlotButtonClass(timeSlot: any): string {
    if (!timeSlot.isActive) {
      return 'bg-gray-300 text-gray-600 opacity-60 cursor-not-allowed';
    }
    
    if (timeSlot.isBooked) {
      return 'bg-red-400 text-white opacity-70 cursor-not-allowed';
    }
    
    return 'bg-green-600 text-white hover:bg-green-700 cursor-pointer';
  }

  getSlotButtonClass(slot: any): string {
    const isSelected = this.selectedSlotView?.id === slot.id;
    const available = slot.maxPatients - slot.bookedPatients;
    const isFull = available === 0;
    const isAlmostFull = available <= 5 && available > 0;
    const isInactive = !slot.isActive;

    if (isSelected) {
      return 'bg-blue-600 text-white border-2 border-blue-600';
    }
    
    if (isInactive) {
      return 'bg-gray-200 text-gray-500 border border-gray-300 opacity-60';
    }
    
    if (isFull) {
      return 'bg-red-50 text-red-700 border border-red-300';
    }
    
    if (isAlmostFull) {
      return 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100';
    }
    
    return 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100';
  }

  autoGenerateSlots(): void {
    if (!this.selectedChamberId || !this.selectedDate) {
      this.error = 'Please select chamber and date first';
      return;
    }

    const chamber = this.chambers.find(c => c.id === this.selectedChamberId);
    if (!chamber) {
      this.error = 'Chamber not found';
      return;
    }

    // Show confirmation with calculation preview
    const openingTime = chamber.openingTime;
    const closingTime = chamber.closingTime;
    const waitingTime = chamber.waitingTimeVisit;
    
    const message = `Auto-generate slots from chamber settings?\n\n` +
      `Chamber: ${chamber.name}\n` +
      `Time: ${openingTime} - ${closingTime}\n` +
      `Waiting time per patient: ${waitingTime} minutes\n` +
      `Estimated patients: Auto-calculated\n\n` +
      `This will create slots for selected date.`;

    if (!confirm(message)) {
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const payload = {
      chamberId: this.selectedChamberId,
      startDate: this.selectedDate,
      endDate: this.selectedDate
    };

    this.apiService.post('/appointment-slots/auto-generate', payload).subscribe({
      next: (response: any) => {
        const calc = response.calculation;
        this.success = `✅ Auto-generated successfully!\n` +
          `Total time: ${calc.totalMinutes} minutes\n` +
          `Per patient: ${calc.waitingTimePerPatient} minutes\n` +
          `Max patients: ${calc.maxPatientsPerSlot}\n` +
          `Slots created: ${response.slotsCreated}`;
        
        this.submitting = false;
        this.loadSlots();
        this.loadStatistics();
        
        setTimeout(() => this.success = '', 5000);
      },
      error: (error: any) => {
        this.error = error.error?.message || 'Failed to auto-generate slots';
        this.submitting = false;
      }
    });
  }
}

