import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-assistant-book-appointment',
  template: `
    <div class="mx-auto max-w-2xl">
      <h1 class="text-2xl font-black tracking-tight text-dark-green flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-dark-green text-2xl">add_circle</span>
        Book Appointment
      </h1>
      <p class="text-slate-600 text-sm mb-6">Book a patient into your doctor’s appointment slot.</p>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 bg-white rounded-xl border border-dark-green/10 shadow-sm p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Chamber *</label>
            <select formControlName="chamberId" class="input w-full">
              <option value="">Select chamber</option>
              <option *ngFor="let c of chambers" [value]="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Date *</label>
            <input type="date" formControlName="appointmentDate" class="input w-full">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Patient phone *</label>
            <input type="text" formControlName="phone" placeholder="01XXXXXXXXX" class="input w-full">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Patient name *</label>
            <input type="text" formControlName="fullName" placeholder="Full name" class="input w-full">
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select formControlName="identifier" class="input w-full">
              <option value="New">New</option>
              <option value="Old">Old</option>
              <option value="Lab">Lab</option>
              <option value="Report">Report</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Gender</label>
            <select formControlName="gender" class="input w-full">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Age</label>
          <input type="number" formControlName="age" min="0" class="input w-full">
        </div>
        <div *ngIf="error" class="text-red-600 text-sm">{{ error }}</div>
        <div *ngIf="success" class="text-green-600 text-sm">{{ success }}</div>
        <div class="flex gap-3 pt-2">
          <button type="submit" [disabled]="form.invalid || submitting" class="rounded-lg bg-ent-primary text-white px-4 py-2 font-bold hover:opacity-90 disabled:opacity-50">
            {{ submitting ? 'Booking...' : 'Book Appointment' }}
          </button>
          <button type="button" (click)="router.navigate(['/assistant/dashboard'])" class="rounded-lg border border-slate-300 text-slate-700 px-4 py-2 font-medium hover:bg-slate-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `
})
export class BookAppointmentComponent implements OnInit {
  form: FormGroup;
  chambers: any[] = [];
  loading = false;
  submitting = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public router: Router
  ) {
    this.form = this.fb.group({
      chamberId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^01[3-9]\d{8}$/)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      identifier: ['New'],
      gender: [''],
      age: [0, [Validators.min(0), Validators.max(150)]]
    });
  }

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({ appointmentDate: today });
    this.apiService.get('/chambers').subscribe({
      next: (res: any) => {
        this.chambers = Array.isArray(res) ? res.filter((c: any) => c.isActive) : [];
      },
      error: () => (this.error = 'Failed to load chambers.')
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitting = true;
    this.error = '';
    this.success = '';
    const val = this.form.value;
    const body = {
      chamberId: +val.chamberId,
      appointmentDate: val.appointmentDate,
      phone: val.phone,
      fullName: val.fullName,
      identifier: val.identifier,
      gender: val.gender || undefined,
      age: val.age ? +val.age : undefined
    };
    this.apiService.post('/appointments', body).subscribe({
      next: () => {
        this.success = 'Appointment booked successfully.';
        this.submitting = false;
        this.form.reset({ appointmentDate: new Date().toISOString().split('T')[0], identifier: 'New', age: 0 });
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to book appointment.';
        this.submitting = false;
      }
    });
  }
}
