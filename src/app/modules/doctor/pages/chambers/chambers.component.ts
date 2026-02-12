import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';

interface Chamber {
  id: number;
  name: string;
  appointmentNumber: string;
  feeFirstTime: number;
  availableDays: string[];
  openingTime: string;
  closingTime: string;
  isActive: boolean;
  createdAt: string;
  address?: string;
}

@Component({
  selector: 'app-chambers',
  templateUrl: './chambers.component.html',
  styleUrls: ['./chambers.component.scss']
})
export class ChambersComponent implements OnInit {
  chambers: Chamber[] = [];
  loading = false;
  showDeleteConfirm = false;
  chamberToDelete: Chamber | null = null;
  error = '';
  success = '';

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadChambers();
  }

  loadChambers(): void {
    this.loading = true;
    this.error = '';
    
    this.apiService.get<Chamber[]>('/chambers').subscribe({
      next: (response: any) => {
        this.chambers = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading chambers:', error);
        this.error = 'Failed to load chambers. Please try again.';
        this.loading = false;
      }
    });
  }

  createChamber(): void {
    this.router.navigate(['/doctor/chambers/new']);
  }

  editChamber(chamber: Chamber): void {
    this.router.navigate(['/doctor/chambers/edit', chamber.id]);
  }

  toggleChamberStatus(chamber: Chamber): void {
    this.apiService.put(`/chambers/${chamber.id}/toggle-status`, {}).subscribe({
      next: (response: any) => {
        chamber.isActive = response.isActive;
        this.success = 'Chamber status updated successfully';
        setTimeout(() => this.success = '', 3000);
      },
      error: (error) => {
        console.error('Error toggling chamber status:', error);
        this.error = 'Failed to update chamber status';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  confirmDelete(chamber: Chamber): void {
    this.chamberToDelete = chamber;
    this.showDeleteConfirm = true;
  }

  deleteChamber(): void {
    if (this.chamberToDelete) {
      const chamberId = this.chamberToDelete.id;
      
      this.apiService.delete(`/chambers/${chamberId}`).subscribe({
        next: () => {
          this.chambers = this.chambers.filter(c => c.id !== chamberId);
          this.success = 'Chamber deleted successfully';
          this.showDeleteConfirm = false;
          this.chamberToDelete = null;
          setTimeout(() => this.success = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting chamber:', error);
          this.error = 'Failed to delete chamber';
          this.showDeleteConfirm = false;
          this.chamberToDelete = null;
          setTimeout(() => this.error = '', 3000);
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.chamberToDelete = null;
  }
}


