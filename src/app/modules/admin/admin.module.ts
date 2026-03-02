import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DoctorListComponent } from './pages/doctors/doctor-list.component';
import { DoctorFormComponent } from './pages/doctors/doctor-form.component';
import { DoctorDetailComponent } from './pages/doctors/doctor-detail.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DoctorListComponent,
    DoctorFormComponent,
    DoctorDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
