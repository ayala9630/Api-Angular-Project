import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, Observer, Subject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Address } from "../address/address";
import { CreateAddress, CreateUser, LoginRequest } from '../../models';
import { UserService } from '../../services/user/user.service';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, Address, NzCollapseModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    userName: this.fb.control('', [Validators.required], [this.userNameAsyncValidator.bind(this)]),
    email: this.fb.control('', [Validators.email, Validators.required], [this.emailAsyncValidator.bind(this)]),
    password: this.fb.control('', [Validators.required]),
    confirm: this.fb.control('', [this.confirmValidator]),
    phone: this.fb.control('', [Validators.required, Validators.pattern(/^0[1-9]\d{7,8}$/)]),
    firstName: this.fb.control(''),
    lastName: this.fb.control('', [Validators.required]),
    address: this.fb.control<CreateAddress | null>(null, [Validators.required]),
  });

  constructor(private userService: UserService,
    private msg: NzMessageService,
    private router: Router,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm.controls.confirm.updateValueAndValidity();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    this.userService.registerUser(this.validateForm.value as CreateUser).subscribe({
      next: (user) => {
        const loginRequest: LoginRequest = {
          userName: this.validateForm.value.userName || '',
          password: this.validateForm.value.password || '',
        };
        this.userService.login(loginRequest).subscribe({
          next: (user) => {
            console.log('User logged in successfully:', user);
            this.cookieService.set('auth_token', user.token);
            this.cookieService.set('user', JSON.stringify(user.user));
            this.msg.create('success', 'נרשמת בהצלחה');
            this.router.navigate(['/home']);
          }
        });
      },
      error: (err) => {
        if( err.status === 400) {
          this.msg.error('שם משתמש או דוא"ל כבר קיימים במערכת');
        }
        else if (err.status === 409) {
          this.msg.error('שם משתמש או דוא"ל כבר קיימים במערכת');
        }
        else if (err.status === 500) {
          this.msg.error('שגיאה פנימית בשרת, אנא נסה שוב מאוחר יותר');
        }
        else if (err.status === 0) {
          this.msg.error('אין חיבור לאינטרנט, אנא בדוק את החיבור שלך');
        }
      }
    });
    this.resetForm1(new MouseEvent('click'));
    this.resetForm2(new MouseEvent('click'));
  }

  addAddress(newAddress: CreateAddress): void {
    console.log("newAddress", newAddress);
    this.validateForm.controls.address.setValue(newAddress);
  }

  resetForm1(e: MouseEvent): void {
    this.validateForm.controls.userName.reset('');
    this.validateForm.controls.email.reset('');
    this.validateForm.controls.password.reset('');
    this.validateForm.controls.confirm.reset('');
  }

  resetForm2(e: MouseEvent): void {
    this.validateForm.controls.phone.reset('');
    this.validateForm.controls.firstName.reset('');
    this.validateForm.controls.lastName.reset('');
  }

  userNameAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    console.log('Checking username:', control.value);
    return this.userService.isUserNameExists(control.value).pipe(
      map(exists => {
        return exists ? { error: true, duplicated: true } : null;
      }),
      catchError((error) => {
        this.msg.error('שגיאה בבדיקת שם משתמש');
        console.error('Error checking username:', error);
        return of(null);
      })
    );
  }

  emailAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) {
      return of(null);
    }
    console.log('Checking email:', control.value);
    return this.userService.isEmailExists(control.value).pipe(
      map(exists => {
        return exists ? { error: true, duplicated: true } : null;
      }),
      catchError((error) => {
        this.msg.error('שגיאה בבדיקת כתובת דוא"ל');
        console.error('Error checking email:', error);
        return of(null);
      })
    );
  }
  confirmValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== control.parent!.value.password) {
      return { confirm: true, error: true };
    }
    return {};
  }
}