import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'location',
        loadChildren: () => import('./modules/location/location.module').then(m => m.LocationModule),
      },
      {
        path: 'services',
        loadChildren: () => import('./modules/services/services.module').then(m => m.ServicesModule),
      },
      {
        path: 'faq',
        loadChildren: () => import('./modules/faq/faq.module').then(m => m.FaqModule),
      },
      {
        path: 'meet-the-doctor',
        loadChildren: () => import('./modules/meet-doctor/meet-doctor.module').then(m => m.MeetDoctorModule),
      },
      {
        path: 'appointment',
        loadChildren: () => import('./modules/appointment/appointment.module').then(m => m.AppointmentModule),
      },
      {
        path: 'patient',
        loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule),
      },
      {
        path: 'tv-display',
        loadChildren: () => import('./modules/tv-display/tv-display.module').then(m => m.TvDisplayModule),
      },
      {
        path: 'assistant',
        loadChildren: () => import('./modules/assistant/assistant.module').then(m => m.AssistantModule),
        canActivate: [AuthGuard],
        data: { role: 'assistant' },
      },
    ],
  },
  {
    path: 'login',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'doctor',
    loadChildren: () => import('./modules/doctor/doctor.module').then(m => m.DoctorModule),
    canActivate: [AuthGuard],
    data: { role: 'doctor' }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


