import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AssistantRoutingModule } from './assistant-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { AssistantLayoutComponent } from './layout/assistant-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AssistantControlButtonsComponent } from './components/control-buttons/control-buttons.component';
import { AssistantChamberStatsComponent } from './components/chamber-stats/chamber-stats.component';
import { ChambersListComponent } from './pages/chambers/chambers-list.component';
import { PatientsListComponent } from './pages/patients/patients-list.component';
import { TodaysAppointmentsComponent } from './pages/appointments/todays-appointments.component';
import { UpcomingAppointmentsComponent } from './pages/appointments/upcoming-appointments.component';
import { BookAppointmentComponent } from './pages/appointments/book-appointment.component';
import { SlotListComponent } from './pages/slots/slot-list.component';
import { ProfileComponent } from './pages/profile/profile.component';

@NgModule({
  declarations: [
    AssistantLayoutComponent,
    DashboardComponent,
    AssistantControlButtonsComponent,
    AssistantChamberStatsComponent,
    ChambersListComponent,
    PatientsListComponent,
    TodaysAppointmentsComponent,
    UpcomingAppointmentsComponent,
    BookAppointmentComponent,
    SlotListComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AssistantRoutingModule,
    SharedModule
  ]
})
export class AssistantModule {}
