import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { BookingComponent } from './pages/booking/booking.component';
import { PatientDashboardComponent } from './pages/dashboard/patient-dashboard.component';

const routes: Routes = [
  { path: 'book', component: BookingComponent },
  {
    path: 'dashboard',
    component: PatientDashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'patient' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }


