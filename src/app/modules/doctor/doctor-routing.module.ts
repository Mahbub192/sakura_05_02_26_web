import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctorLayoutComponent } from './layout/doctor-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChambersComponent } from './pages/chambers/chambers.component';
import { ChamberFormComponent } from './pages/chambers/chamber-form/chamber-form.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { AppointmentFormComponent } from './pages/appointments/appointment-form/appointment-form.component';
import { TodaysAppointmentsComponent } from './pages/appointments/todays-appointments/todays-appointments.component';
import { UpcomingAppointmentsComponent } from './pages/appointments/upcoming-appointments/upcoming-appointments.component';
import { AppointmentHistoryComponent } from './pages/appointments/appointment-history/appointment-history.component';
import { SlotManagementComponent } from './pages/appointment-slots/slot-management/slot-management.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: DoctorLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'chambers', component: ChambersComponent },
      { path: 'chambers/new', component: ChamberFormComponent },
      { path: 'chambers/edit/:id', component: ChamberFormComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'appointments/new', component: AppointmentFormComponent },
      { path: 'appointments/today', component: TodaysAppointmentsComponent },
      { path: 'appointments/upcoming', component: UpcomingAppointmentsComponent },
      { path: 'appointments/history', component: AppointmentHistoryComponent },
      { path: 'appointment-slots', component: SlotManagementComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorRoutingModule { }


