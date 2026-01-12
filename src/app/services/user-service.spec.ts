import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://161.97.128.217:8081/users';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(this.apiUrl, { headers });
  }

  getUserById(id: string): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers });
  }

  createUser(user: User): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.post<User>(this.apiUrl, user, { headers });
  }

  updateUser(id: string, user: User): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers });
  }

  deleteUser(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}