import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssistantLayoutComponent } from './layout/assistant-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ChambersListComponent } from './pages/chambers/chambers-list.component';
import { PatientsListComponent } from './pages/patients/patients-list.component';
import { TodaysAppointmentsComponent } from './pages/appointments/todays-appointments.component';
import { UpcomingAppointmentsComponent } from './pages/appointments/upcoming-appointments.component';
import { BookAppointmentComponent } from './pages/appointments/book-appointment.component';
import { SlotListComponent } from './pages/slots/slot-list.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: AssistantLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'chambers', component: ChambersListComponent },
      { path: 'patients', component: PatientsListComponent },
      { path: 'appointments/today', component: TodaysAppointmentsComponent },
      { path: 'appointments/upcoming', component: UpcomingAppointmentsComponent },
      { path: 'appointments/new', component: BookAppointmentComponent },
      { path: 'appointment-slots', component: SlotListComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistantRoutingModule {}
