import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Login as LoginService,
  LoginResponse
} from '../services/login';

import { Auth } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';

  loading = false;
  errorMessage = '';

  constructor(
    private loginService: LoginService,
    private router: Router,
    private auth: Auth
  ) {}

  login(): void {

    this.errorMessage = '';

    if (!this.username || !this.password) {

      this.errorMessage =
        'กรุณากรอก username และ password';

      return;
    }

    this.loading = true;

    this.loginService
      .login(this.username, this.password)
      .subscribe({

        next: (response: LoginResponse) => {

          console.log(
            'Login response:',
            response
          );

          this.loading = false;

          if (response.success && response.user) {

            console.log(
              'Login successful'
            );

            console.log(
              'User:',
              response.user
            );

            // เก็บข้อมูลผู้ใช้งาน
            this.auth.setUser(
              response.user
            );

            console.log(
              'Stored user:',
              this.auth.getUser()
            );

            // ไปหน้าหลัก
            this.router.navigate([
              '/main'
            ]);

          } else {

            this.errorMessage =
              response.message ||
              'เข้าสู่ระบบไม่สำเร็จ';
          }
        },

        error: (error) => {

          console.error(
            'Login API error:',
            error
          );

          this.loading = false;

          if (error.status === 401) {

            this.errorMessage =
              'Username หรือ Password ไม่ถูกต้อง';

          } else if (error.status === 0) {

            this.errorMessage =
              'ไม่สามารถเชื่อมต่อ Login API ได้';

          } else {

            this.errorMessage =
              'ระบบมีปัญหา กรุณาลองใหม่อีกครั้ง';
          }
        }

      });
  }

}