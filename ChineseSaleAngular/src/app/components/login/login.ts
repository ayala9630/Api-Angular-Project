import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserService } from '../../services/user/user.service';
import { LoginRequest } from '../../models';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private userservice: UserService) { }
    private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    userName: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userservice.login(this.validateForm.value as LoginRequest).subscribe({
        next: (response) => {
          alert('Login successful!');
        }
      }); 
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
