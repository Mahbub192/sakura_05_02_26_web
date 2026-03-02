import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

export interface User {
  id: number;
  code?: string;
  phone: string;
  email?: string;
  role: 'admin' | 'doctor' | 'assistant' | 'patient';
  fullName: string;
  isActive: boolean;
  education?: string;
  address?: string;
  age?: number;
  profilePicture?: string;
  chambers?: { id: number; code?: string; name: string }[];
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  education?: string;
  address?: string;
  age?: number;
}

export interface LoginRequest {
  phone: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.storage.getUser(),
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.storage.getToken();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.storage.setToken(response.token);
          this.storage.setRefreshToken(response.refreshToken);
          this.storage.setUser(response.user);
          this.currentUserSubject.next(response.user);
        }),
      );
  }

  logout(): void {
    this.storage.clearAll();
    this.currentUserSubject.next(null);
    if (!this.router.url.startsWith('/appointment')) {
      this.router.navigate(['/']);
    }
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.storage.getRefreshToken();
    return this.http
      .post<any>(`${environment.apiUrl}/auth/refresh-token`, { refreshToken })
      .pipe(
        tap((response) => {
          this.storage.setToken(response.token);
        }),
      );
  }

  forgotPassword(phone: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/forgot-password`, {
      phone,
    });
  }

  resetPassword(
    phone: string,
    otp: string,
    newPassword: string,
  ): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, {
      phone,
      otp,
      newPassword,
    });
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user?.role === role;
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`);
  }

  updateProfile(body: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/me`, body).pipe(
      tap((user) => {
        this.storage.setUser(user);
        this.currentUserSubject.next(user);
      }),
    );
  }

  uploadProfilePicture(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<User>(`${environment.apiUrl}/users/me/avatar`, formData).pipe(
      tap((user) => {
        this.storage.setUser(user);
        this.currentUserSubject.next(user);
      }),
    );
  }
}
