import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeetDoctorComponent } from './meet-doctor.component';

const routes: Routes = [
  { path: '', component: MeetDoctorComponent },
];

@NgModule({
  declarations: [MeetDoctorComponent],
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class MeetDoctorModule { }
