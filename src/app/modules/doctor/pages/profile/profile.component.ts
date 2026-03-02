import { Component, OnInit } from '@angular/core';
import { AuthService, User, UpdateProfileRequest } from '../../../../core/services/auth.service';
import { ApiService } from '../../../../core/services/api.service';

/** Chamber row for profile display (id, code, name) */
interface ChamberDisplay {
  id: number;
  code?: string;
  name: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile: User | null = null;
  /** Chambers to show: from GET /chambers for doctor (matches All Chambers), else from profile */
  chambers: ChamberDisplay[] = [];
  loading = true;
  saving = false;
  uploadingPhoto = false;
  error: string | null = null;
  success = false;

  form: UpdateProfileRequest & { age?: number | string | null } = {
    fullName: '',
    email: '',
    phone: '',
    education: '',
    address: '',
    age: undefined,
  };

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.profile = res;
        this.form = {
          fullName: res.fullName ?? '',
          email: res.email ?? '',
          phone: res.phone ?? '',
          education: res.education ?? '',
          address: res.address ?? '',
          age: res.age ?? undefined,
        };
        if (res.role === 'doctor') {
          this.apiService.get<ChamberDisplay[]>('/chambers').subscribe({
            next: (list) => {
              this.chambers = list?.map((c) => ({ id: c.id, code: (c as any).code, name: c.name })) ?? [];
              this.loading = false;
            },
            error: () => {
              this.chambers = res.chambers ?? [];
              this.loading = false;
            },
          });
        } else {
          this.chambers = res.chambers ?? [];
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load profile.';
        this.loading = false;
      },
    });
  }

  save(): void {
    if (!this.profile) return;
    this.saving = true;
    this.error = null;
    this.success = false;
    const body: UpdateProfileRequest = {};
    if (this.form.fullName !== undefined) body.fullName = this.form.fullName;
    if (this.form.email !== undefined) body.email = this.form.email || undefined;
    if (this.form.phone !== undefined) body.phone = this.form.phone;
    if (this.form.education !== undefined) body.education = this.form.education || undefined;
    if (this.form.address !== undefined) body.address = this.form.address || undefined;
    if (this.form.age !== undefined && this.form.age !== null) {
      const raw = this.form.age;
      const n = typeof raw === 'number' ? raw : parseInt(String(raw), 10);
      if (!isNaN(n)) body.age = n;
    }
    this.authService.updateProfile(body).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.chambers = updated.chambers ?? this.chambers;
        this.form = {
          fullName: updated.fullName ?? '',
          email: updated.email ?? '',
          phone: updated.phone ?? '',
          education: updated.education ?? '',
          address: updated.address ?? '',
          age: updated.age ?? undefined,
        };
        this.saving = false;
        this.success = true;
        setTimeout(() => (this.success = false), 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update profile.';
        this.saving = false;
      },
    });
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      this.error = 'Please select an image file.';
      return;
    }
    this.uploadingPhoto = true;
    this.error = null;
    this.authService.uploadProfilePicture(file).subscribe({
      next: (updated) => {
        this.profile = updated;
        this.chambers = updated.chambers ?? this.chambers;
        this.uploadingPhoto = false;
        this.success = true;
        setTimeout(() => (this.success = false), 3000);
        input.value = '';
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to upload photo.';
        this.uploadingPhoto = false;
        input.value = '';
      },
    });
  }
}
