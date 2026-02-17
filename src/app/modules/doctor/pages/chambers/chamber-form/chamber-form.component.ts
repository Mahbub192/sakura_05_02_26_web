import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../../core/services/api.service';

@Component({
  selector: 'app-chamber-form',
  templateUrl: './chamber-form.component.html',
  styleUrls: ['./chamber-form.component.scss']
})
export class ChamberFormComponent implements OnInit {
  chamberForm: FormGroup;
  isEditMode = false;
  chamberId: number | null = null;
  loading = false;
  submitting = false;
  error = '';
  success = '';

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  audioOptions = ['None', 'Bangla', 'English'];
  audioGenders = ['Male', 'Female'];
  videoVolumes = ['Off', 'Low', 'Medium', 'High'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.chamberForm = this.fb.group({
      name: ['', Validators.required],
      appointmentNumber: ['', Validators.required],
      availableDays: [[], Validators.required],
      openingTime: ['', Validators.required],
      reportTime: [''],
      closingTime: ['', Validators.required],
      waitingTimeVisit: [15, [Validators.required, Validators.min(5)]],
      waitingTimeReport: [10, [Validators.required, Validators.min(5)]],
      feeFirstTime: [0, [Validators.required, Validators.min(0)]],
      feeFollowup: [0, [Validators.required, Validators.min(0)]],
      address: ['', Validators.required],
      showSerialsInApp: [true],
      appUsersCanBook: [true],
      autoDeleteDaily: [false],
      useMultipleDevices: [true],
      audioType: ['Bangla'],
      audioGender: ['Male'],
      videoUrl: [''],
      videoVolume: ['Medium']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.chamberId = +params['id'];
        this.loadChamberData(this.chamberId);
      }
    });
  }

  loadChamberData(id: number): void {
    this.loading = true;
    this.error = '';
    
    this.apiService.get(`/chambers/${id}`).subscribe({
      next: (chamber: any) => {
        // Format time fields (remove seconds if present)
        const formatTime = (time: string) => {
          if (!time) return '';
          return time.substring(0, 5); // Get HH:MM from HH:MM:SS
        };

        // Ensure availableDays is a valid array with proper enum values
        let availableDays = chamber.availableDays || [];
        if (!Array.isArray(availableDays)) {
          availableDays = [];
        }
        // Filter to only include valid day names
        const validDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        availableDays = availableDays.filter((day: string) => validDays.includes(day));

        this.chamberForm.patchValue({
          name: chamber.name,
          appointmentNumber: chamber.appointmentNumber,
          availableDays: availableDays,
          openingTime: formatTime(chamber.openingTime),
          reportTime: formatTime(chamber.reportTime),
          closingTime: formatTime(chamber.closingTime),
          waitingTimeVisit: chamber.waitingTimeVisit,
          waitingTimeReport: chamber.waitingTimeReport,
          feeFirstTime: chamber.feeFirstTime,
          feeFollowup: chamber.feeFollowup,
          address: chamber.address,
          showSerialsInApp: chamber.showSerialsInApp ?? true,
          appUsersCanBook: chamber.appUsersCanBook ?? true,
          autoDeleteDaily: chamber.autoDeleteDaily ?? false,
          useMultipleDevices: chamber.useMultipleDevices ?? true,
          audioType: chamber.audioType || 'Bangla',
          audioGender: chamber.audioGender || 'Male',
          videoUrl: chamber.videoUrl || '',
          videoVolume: chamber.videoVolume || 'Medium'
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading chamber:', error);
        if (error.status === 401) {
          this.error = 'Session expired. Please login again.';
        } else {
          this.error = error.error?.message || 'Failed to load chamber data';
        }
        this.loading = false;
      }
    });
  }

  toggleDay(day: string): void {
    const currentDays = this.chamberForm.get('availableDays')?.value || [];
    const index = currentDays.indexOf(day);
    
    if (index > -1) {
      currentDays.splice(index, 1);
    } else {
      currentDays.push(day);
    }
    
    this.chamberForm.patchValue({ availableDays: currentDays });
  }

  isDaySelected(day: string): boolean {
    const selectedDays = this.chamberForm.get('availableDays')?.value || [];
    return selectedDays.includes(day);
  }

  onSubmit(): void {
    if (this.chamberForm.invalid) {
      Object.keys(this.chamberForm.controls).forEach(key => {
        this.chamberForm.get(key)?.markAsTouched();
      });
      this.error = 'Please fill in all required fields';
      return;
    }

    // Validate availableDays
    const availableDays = this.chamberForm.get('availableDays')?.value || [];
    if (!Array.isArray(availableDays) || availableDays.length === 0) {
      this.error = 'Please select at least one available day';
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    let formData;
    try {
      formData = this.prepareFormData();
    } catch (e: any) {
      this.error = e.message || 'Invalid form data';
      this.submitting = false;
      return;
    }

    if (this.isEditMode && this.chamberId) {
      // Update existing chamber
      this.apiService.put(`/chambers/${this.chamberId}`, formData).subscribe({
        next: (response: any) => {
          this.success = 'Chamber updated successfully!';
          this.submitting = false;
          setTimeout(() => {
            this.router.navigate(['/doctor/chambers']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error updating chamber:', error);
          if (error.status === 401) {
            this.error = 'Session expired. Please login again.';
          } else if (error.status === 400) {
            // Parse validation errors
            const errorMessage = error.error?.message || error.error?.error || 'Validation error';
            if (Array.isArray(error.error?.message)) {
              this.error = error.error.message.join(', ');
            } else {
              this.error = errorMessage;
            }
          } else {
            this.error = error.error?.message || 'Failed to update chamber';
          }
          this.submitting = false;
        }
      });
    } else {
      // Create new chamber
      this.apiService.post('/chambers', formData).subscribe({
        next: (response: any) => {
          this.success = 'Chamber created successfully!';
          this.submitting = false;
          setTimeout(() => {
            this.router.navigate(['/doctor/chambers']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error creating chamber:', error);
          if (error.status === 401) {
            this.error = 'Session expired. Please login again.';
          } else if (error.status === 400) {
            // Parse validation errors
            const errorMessage = error.error?.message || error.error?.error || 'Validation error';
            if (Array.isArray(error.error?.message)) {
              this.error = error.error.message.join(', ');
            } else {
              this.error = errorMessage;
            }
          } else {
            this.error = error.error?.message || 'Failed to create chamber';
          }
          this.submitting = false;
        }
      });
    }
  }

  prepareFormData(): any {
    const formValue = this.chamberForm.value;
    
    // Format time fields to HH:MM:SS format for backend
    const formatTime = (time: string) => {
      if (!time) return null;
      return time.includes(':') ? `${time}:00` : time;
    };

    // Validate and clean availableDays
    let availableDays = formValue.availableDays || [];
    if (!Array.isArray(availableDays)) {
      availableDays = [];
    }
    // Ensure only valid enum values are sent
    const validDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    availableDays = availableDays.filter((day: string) => validDays.includes(day));
    
    // Ensure at least one day is selected
    if (availableDays.length === 0) {
      throw new Error('Please select at least one available day');
    }

    // Clean video URL - remove empty strings
    let videoUrl = formValue.videoUrl;
    if (videoUrl && typeof videoUrl === 'string') {
      videoUrl = videoUrl.trim();
      if (videoUrl === '') {
        videoUrl = null;
      }
    } else {
      videoUrl = null;
    }

    return {
      name: formValue.name,
      appointmentNumber: formValue.appointmentNumber,
      availableDays: availableDays,
      openingTime: formatTime(formValue.openingTime),
      closingTime: formatTime(formValue.closingTime),
      reportTime: formatTime(formValue.reportTime),
      waitingTimeVisit: Number(formValue.waitingTimeVisit),
      waitingTimeReport: Number(formValue.waitingTimeReport),
      feeFirstTime: Number(formValue.feeFirstTime),
      feeFollowup: Number(formValue.feeFollowup),
      address: formValue.address,
      showSerialsInApp: formValue.showSerialsInApp ?? true,
      appUsersCanBook: formValue.appUsersCanBook ?? true,
      autoDeleteDaily: formValue.autoDeleteDaily ?? false,
      useMultipleDevices: formValue.useMultipleDevices ?? true,
      audioType: formValue.audioType || 'Bangla',
      audioGender: formValue.audioGender || 'Male',
      videoUrl: videoUrl,
      videoVolume: formValue.videoVolume || 'Medium',
      doctorId: 1 // This will be set from authenticated user in backend
    };
  }

  cancel(): void {
    this.router.navigate(['/doctor/chambers']);
  }
}


