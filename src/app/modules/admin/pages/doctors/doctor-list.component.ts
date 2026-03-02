import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, DoctorListItem } from '../../services/admin.service';

@Component({
  selector: 'app-doctor-list',
  templateUrl: './doctor-list.component.html',
  styleUrls: ['./doctor-list.component.scss'],
})
export class DoctorListComponent implements OnInit {
  doctors: DoctorListItem[] = [];
  loading = true;
  error: string | null = null;
  actionLoading: Record<number, string | null> = {};

  constructor(
    private adminService: AdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getDoctors().subscribe({
      next: (list) => {
        this.doctors = list;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load doctors.';
        this.loading = false;
      },
    });
  }

  create(): void {
    this.router.navigate(['/admin/doctors/new']);
  }

  edit(d: DoctorListItem): void {
    this.router.navigate(['/admin/doctors', d.id, 'edit']);
  }

  viewDetail(d: DoctorListItem): void {
    this.router.navigate(['/admin/doctors', d.id]);
  }

  toggleActive(d: DoctorListItem): void {
    this.actionLoading[d.id] = 'active';
    this.adminService.setDoctorActive(d.id, !d.isActive).subscribe({
      next: (updated) => {
        d.isActive = updated.isActive;
        this.actionLoading[d.id] = null;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update.';
        this.actionLoading[d.id] = null;
      },
    });
  }

  delete(d: DoctorListItem): void {
    if (!confirm(`Delete doctor "${d.fullName}" (${d.code})?`)) return;
    this.actionLoading[d.id] = 'delete';
    this.adminService.deleteDoctor(d.id).subscribe({
      next: () => {
        this.doctors = this.doctors.filter((x) => x.id !== d.id);
        this.actionLoading[d.id] = null;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to delete.';
        this.actionLoading[d.id] = null;
      },
    });
  }
}
