import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientRoutingModule } from './patient-routing.module';
import { BookingComponent } from './pages/booking/booking.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BookingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PatientRoutingModule,
    SharedModule
  ]
})
export class PatientModule { }


