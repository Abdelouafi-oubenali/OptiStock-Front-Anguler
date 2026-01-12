import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(data: any) {
    console.log('AuthService login called with data:', data);
    return this.http.post('http://161.97.128.217:8081/api/auth/login', data);
  }
}
