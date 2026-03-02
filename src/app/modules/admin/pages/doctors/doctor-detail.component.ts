import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService, DoctorListItem, AssistantListItem, ChamberListItem } from '../../services/admin.service';

@Component({
  selector: 'app-doctor-detail',
  templateUrl: './doctor-detail.component.html',
  styleUrls: ['./doctor-detail.component.scss'],
})
export class DoctorDetailComponent implements OnInit {
  doctor: DoctorListItem | null = null;
  assistants: AssistantListItem[] = [];
  chambers: ChamberListItem[] = [];
  loading = true;
  error: string | null = null;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getDoctor(this.id).subscribe({
      next: (d) => {
        this.doctor = d;
        this.loadAssistants();
        this.loadChambers();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Doctor not found.';
        this.loading = false;
      },
    });
  }

  loadAssistants(): void {
    this.adminService.getDoctorAssistants(this.id).subscribe({
      next: (list) => (this.assistants = list),
      error: () => (this.assistants = []),
    });
  }

  loadChambers(): void {
    this.adminService.getDoctorChambers(this.id).subscribe({
      next: (list) => (this.chambers = list),
      error: () => (this.chambers = []),
    });
  }

  back(): void {
    this.router.navigate(['/admin/doctors']);
  }

  edit(): void {
    this.router.navigate(['/admin/doctors', this.id, 'edit']);
  }
}
