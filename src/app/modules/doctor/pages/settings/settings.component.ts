import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  loading = false;
  success = '';

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      patientsCanBook: [true],
      enableFraudPayment: [true],
      fullPaymentRequired: [false],
      onlineAppointmentTime: ['11:00'],
      showSerialsInApp: [true],
      useMultipleDevices: [true],
      audioType: ['Bangla'],
      audioGender: ['Male'],
      videoVolume: ['Medium'],
      language: ['English']
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.success = 'Settings saved successfully!';
      setTimeout(() => this.success = '', 3000);
    }, 1000);
  }
}


