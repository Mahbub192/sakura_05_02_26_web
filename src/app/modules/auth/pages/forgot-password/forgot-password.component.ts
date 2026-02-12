import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  step: 'phone' | 'otp' | 'newPassword' = 'phone';
  phoneForm: FormGroup;
  otpForm: FormGroup;
  resetForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  phone = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.phoneForm = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.pattern(/^01[3-9]\d{8}$/)]]
    });

    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });

    this.resetForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void { }

  passwordMatchValidator(group: FormGroup): any {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmitPhone(): void {
    if (this.phoneForm.invalid) {
      this.phoneForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.phone = this.phoneForm.value.phone;

    this.authService.forgotPassword(this.phone).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'OTP sent to your phone number';
        this.step = 'otp';
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to send OTP';
      }
    });
  }

  onSubmitOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.error = '';
    this.step = 'newPassword';
  }

  onSubmitReset(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const otp = this.otpForm.value.otp;
    const newPassword = this.resetForm.value.newPassword;

    this.authService.resetPassword(this.phone, otp, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Password reset successfully';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error?.message || 'Failed to reset password';
      }
    });
  }

  goBack(): void {
    if (this.step === 'otp') {
      this.step = 'phone';
    } else if (this.step === 'newPassword') {
      this.step = 'otp';
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}


