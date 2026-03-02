import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DoctorListComponent } from './pages/doctors/doctor-list.component';
import { DoctorFormComponent } from './pages/doctors/doctor-form.component';
import { DoctorDetailComponent } from './pages/doctors/doctor-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'doctors', pathMatch: 'full' },
      { path: 'dashboard', redirectTo: 'doctors', pathMatch: 'full' },
      { path: 'doctors', component: DoctorListComponent },
      { path: 'doctors/new', component: DoctorFormComponent },
      { path: 'doctors/:id', component: DoctorDetailComponent },
      { path: 'doctors/:id/edit', component: DoctorFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
