import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService, CreateDoctorRequest, UpdateDoctorRequest } from '../../services/admin.service';

@Component({
  selector: 'app-doctor-form',
  templateUrl: './doctor-form.component.html',
  styleUrls: ['./doctor-form.component.scss'],
})
export class DoctorFormComponent implements OnInit {
  isEdit = false;
  id: number | null = null;
  form = { phone: '', fullName: '', email: '' };
  loading = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.id = +id;
      this.loadDoctor();
    }
  }

  loadDoctor(): void {
    if (!this.id) return;
    this.loading = true;
    this.adminService.getDoctor(this.id).subscribe({
      next: (d) => {
        this.form = {
          phone: d.phone,
          fullName: d.fullName ?? '',
          email: d.email ?? '',
        };
        this.loading = false;
      },
      error: () => {
        this.error = 'Doctor not found.';
        this.loading = false;
      },
    });
  }

  submit(): void {
    this.error = null;
    this.success = null;
    if (!this.form.phone.trim()) {
      this.error = 'Phone is required.';
      return;
    }
    this.loading = true;
    if (this.isEdit && this.id) {
      const body: UpdateDoctorRequest = {
        phone: this.form.phone.trim(),
        fullName: this.form.fullName.trim() || undefined,
        email: this.form.email.trim() || undefined,
      };
      this.adminService.updateDoctor(this.id, body).subscribe({
        next: () => {
          this.success = 'Doctor updated.';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/doctors']), 1500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Update failed.';
          this.loading = false;
        },
      });
    } else {
      const body: CreateDoctorRequest = {
        phone: this.form.phone.trim(),
        fullName: this.form.fullName.trim() || undefined,
        email: this.form.email.trim() || undefined,
      };
      this.adminService.createDoctor(body).subscribe({
        next: (res) => {
          this.success = (res as any).message || 'Doctor created. Default password: password123';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/admin/doctors']), 2500);
        },
        error: (err) => {
          this.error = err.error?.message || 'Create failed.';
          this.loading = false;
        },
      });
    }
  }

  back(): void {
    this.router.navigate(['/admin/doctors']);
  }
}
