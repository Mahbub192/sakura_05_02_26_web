import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DoctorRoutingModule } from './doctor-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Layout
import { DoctorLayoutComponent } from './layout/doctor-layout.component';

// Pages
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

// Components
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { ControlButtonsComponent } from './components/control-buttons/control-buttons.component';
import { ChamberStatsComponent } from './components/chamber-stats/chamber-stats.component';

@NgModule({
  declarations: [
    DoctorLayoutComponent,
    DashboardComponent,
    ChambersComponent,
    ChamberFormComponent,
    AppointmentsComponent,
    AppointmentFormComponent,
    TodaysAppointmentsComponent,
    UpcomingAppointmentsComponent,
    AppointmentHistoryComponent,
    SlotManagementComponent,
    SettingsComponent,
    ProfileComponent,
    PatientListComponent,
    ControlButtonsComponent,
    ChamberStatsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DoctorRoutingModule,
    SharedModule
  ]
})
export class DoctorModule { }


