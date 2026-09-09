import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginUser {
  emp_id: number;
  user_id: number;
  role_id: number;
  username: string;
  name_thai: string;
  surname_thai: string;
  hrmi_id: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: LoginUser;
}

@Injectable({
  providedIn: 'root'
})
export class Login {

  private readonly apiUrl =
    'http://localhost:8000/login.php';

  constructor(
    private http: HttpClient
  ) {}

  login(
    username: string,
    password: string
  ): Observable<LoginResponse> {

    const request: LoginRequest = {
      username,
      password
    };

    return this.http.post<LoginResponse>(
      this.apiUrl,
      request
    );
  }
}