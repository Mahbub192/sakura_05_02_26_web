import { Component } from '@angular/core';

@Component({
  selector: 'app-meet-doctor',
  templateUrl: './meet-doctor.component.html',
  styleUrls: ['./meet-doctor.component.scss'],
})
export class MeetDoctorComponent {
  currentYear = new Date().getFullYear();
}
