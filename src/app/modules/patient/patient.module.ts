import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientRoutingModule } from './patient-routing.module';
import { BookingComponent } from './pages/booking/booking.component';
import { PatientDashboardComponent } from './pages/dashboard/patient-dashboard.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BookingComponent,
    PatientDashboardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PatientRoutingModule,
    SharedModule,
  ],
})
export class PatientModule { }


