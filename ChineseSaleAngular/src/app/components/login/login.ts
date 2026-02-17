import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserService } from '../../services/user/user.service';
import { LoginRequest } from '../../models';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../services/global/global.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(
    private userService: UserService,
    private cookieService: CookieService,
    private router: Router,
    private msg : NzMessageService,
    private global: GlobalService
  ) { }

  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    userName: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });
  isLoadingOne = false;
  isLoadingTwo = false;
  time:number = 40000
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.userService.login(this.validateForm.value as LoginRequest).subscribe({
        next: (user) => {
          this.time=40000;
          console.log('User logged in successfully:', user);
          // this.cookieService.set('auth_token', user.token);
          // this.cookieService.set('user', JSON.stringify(user.user));
          // this.global.user.set(user.user);
          this.global.login(user);
          this.msg.create('success', 'התחברת בהצלחה');
          this.router.navigate(['/home']);
        },
        error:(err)=> {
          this.time=2000;
          if (err.status === 401) {
            console.error('Invalid credentials:', err);
            this.msg.error('שם משתמש או סיסמה שגויים');
          }
          else {
            console.error('Login failed:', err);
            this.msg.error('התחברות נכשלה, אנא נסה שוב מאוחר יותר');
          }
        },
      });

    }
  }
  loadOne(): void {
    this.isLoadingOne = true;
    setTimeout(() => {
      this.isLoadingOne = false;
    },this.time );
  }
}