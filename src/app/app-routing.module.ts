import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
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
    path: 'assistant',
    loadChildren: () => import('./modules/assistant/assistant.module').then(m => m.AssistantModule),
    canActivate: [AuthGuard],
    data: { role: 'assistant' }
  },
  {
    path: 'patient',
    loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule)
  },
  {
    path: 'tv-display',
    loadChildren: () => import('./modules/tv-display/tv-display.module').then(m => m.TvDisplayModule)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


