import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DoctorListItem {
  id: number;
  code: string;
  fullName: string;
  phone: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateDoctorRequest {
  phone: string;
  fullName?: string;
  email?: string;
}

export interface UpdateDoctorRequest {
  phone?: string;
  fullName?: string;
  email?: string;
}

export interface AssistantListItem {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ChamberListItem {
  id: number;
  code: string;
  name: string;
  appointmentNumber: string;
  isActive: boolean;
  address: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private base = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<DoctorListItem[]> {
    return this.http.get<DoctorListItem[]>(`${this.base}/doctors`);
  }

  getDoctor(id: number): Observable<DoctorListItem> {
    return this.http.get<DoctorListItem>(`${this.base}/doctors/${id}`);
  }

  createDoctor(body: CreateDoctorRequest): Observable<DoctorListItem & { message?: string }> {
    return this.http.post<DoctorListItem & { message?: string }>(`${this.base}/doctors`, body);
  }

  updateDoctor(id: number, body: UpdateDoctorRequest): Observable<DoctorListItem> {
    return this.http.put<DoctorListItem>(`${this.base}/doctors/${id}`, body);
  }

  setDoctorActive(id: number, isActive: boolean): Observable<DoctorListItem> {
    return this.http.patch<DoctorListItem>(`${this.base}/doctors/${id}/active`, { isActive });
  }

  deleteDoctor(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/doctors/${id}`);
  }

  getDoctorAssistants(doctorId: number): Observable<AssistantListItem[]> {
    return this.http.get<AssistantListItem[]>(`${this.base}/doctors/${doctorId}/assistants`);
  }

  getDoctorChambers(doctorId: number): Observable<ChamberListItem[]> {
    return this.http.get<ChamberListItem[]>(`${this.base}/doctors/${doctorId}/chambers`);
  }
}
