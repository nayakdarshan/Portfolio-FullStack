import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getProfile(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.api}/profile`);
  }

  getSkills(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.api}/skills`);
  }

  getExperience(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.api}/experience`);
  }

  getProjects(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.api}/projects`);
  }

  getEducation(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.api}/education`);
  }

  submitContact(data: { name: string; email: string; subject: string; message: string }): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.api}/contact`, data);
  }

  getResumeDownloadUrl(): string {
    return `${this.api}/resume/download`;
  }

  // Admin endpoints
  updateProfile(data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.api}/profile`, data);
  }

  createSkillGroup(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.api}/skills`, data);
  }

  updateSkillGroup(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.api}/skills/${id}`, data);
  }

  deleteSkillGroup(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.api}/skills/${id}`);
  }

  createExperience(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.api}/experience`, data);
  }

  updateExperience(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.api}/experience/${id}`, data);
  }

  deleteExperience(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.api}/experience/${id}`);
  }

  createProject(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.api}/projects`, data);
  }

  updateProject(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.api}/projects/${id}`, data);
  }

  deleteProject(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.api}/projects/${id}`);
  }

  updateEducation(id: string, data: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.api}/education/${id}`, data);
  }

  getMessages(page = 1, limit = 20): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.api}/contact/messages?page=${page}&limit=${limit}`);
  }

  markMessageRead(id: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.api}/contact/messages/${id}/read`, {});
  }

  deleteMessage(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.api}/contact/messages/${id}`);
  }

  getUnreadCount(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.api}/contact/messages/unread-count`);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.api}/auth/change-password`, {
      currentPassword,
      newPassword,
    });
  }

  uploadResume(file: File): Observable<ApiResponse<any>> {
    const form = new FormData();
    form.append('resume', file);
    return this.http.post<ApiResponse<any>>(`${this.api}/resume/upload`, form);
  }

  uploadPhoto(file: File): Observable<ApiResponse<any>> {
    const form = new FormData();
    form.append('photo', file);
    return this.http.post<ApiResponse<any>>(`${this.api}/profile/upload-photo`, form);
  }

  seedDatabase(data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.api}/profile`, data);
  }
}
