import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserService } from '../../services/user/user.service';
import { LoginRequest } from '../../models';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private userService: UserService, private cookieService:CookieService) {}

  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    userName: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.login(this.validateForm.value as LoginRequest).subscribe({
        next: (user) => {
          console.log('User logged in successfully:', user);
          this.cookieService.set('auth_token', user.token);
        }
    });
    // } else {
    //   Object.values(this.validateForm.controls).forEach(control => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });
    }
  }
}
