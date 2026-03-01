import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppointmentPageComponent } from './appointment-page.component';

const routes: Routes = [
  { path: '', component: AppointmentPageComponent },
];

@NgModule({
  declarations: [AppointmentPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class AppointmentModule {}
