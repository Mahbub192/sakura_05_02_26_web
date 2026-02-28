import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { PatientLayoutComponent } from './layout/patient-layout.component';
import { AppointmentsTodayComponent } from './pages/appointments-today/appointments-today.component';
import { BookingComponent } from './pages/booking/booking.component';
import { DoctorPrescriptionsComponent } from './pages/doctor-prescriptions/doctor-prescriptions.component';
import { PatientDashboardComponent } from './pages/dashboard/patient-dashboard.component';
import { UploadImageComponent } from './pages/upload-image/upload-image.component';

const routes: Routes = [
  {
    path: '',
    component: PatientLayoutComponent,
    children: [
      { path: 'book', component: BookingComponent },
      {
        path: 'dashboard',
        component: PatientDashboardComponent,
        canActivate: [AuthGuard],
        data: { role: 'patient' },
      },
      {
        path: 'appointments/today',
        component: AppointmentsTodayComponent,
        canActivate: [AuthGuard],
        data: { role: 'patient' },
      },
      {
        path: 'health-record/upload-image',
        component: UploadImageComponent,
        canActivate: [AuthGuard],
        data: { role: 'patient' },
      },
      {
        path: 'health-record/doctor-prescriptions',
        component: DoctorPrescriptionsComponent,
        canActivate: [AuthGuard],
        data: { role: 'patient' },
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }


