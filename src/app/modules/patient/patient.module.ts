import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientRoutingModule } from './patient-routing.module';
import { PatientLayoutComponent } from './layout/patient-layout.component';
import { AppointmentsTodayComponent } from './pages/appointments-today/appointments-today.component';
import { BookingComponent } from './pages/booking/booking.component';
import { AppointmentsAllComponent } from './pages/appointments-all/appointments-all.component';
import { DoctorPrescriptionsComponent } from './pages/doctor-prescriptions/doctor-prescriptions.component';
import { HealthCartComponent } from './pages/health-cart/health-cart.component';
import { PatientDashboardComponent } from './pages/dashboard/patient-dashboard.component';
import { UploadImageComponent } from './pages/upload-image/upload-image.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PatientLayoutComponent,
    BookingComponent,
    PatientDashboardComponent,
    AppointmentsTodayComponent,
    AppointmentsAllComponent,
    UploadImageComponent,
    DoctorPrescriptionsComponent,
    HealthCartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    PatientRoutingModule,
    SharedModule,
  ],
})
export class PatientModule { }


