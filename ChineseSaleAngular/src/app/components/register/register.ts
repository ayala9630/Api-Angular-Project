import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Address } from "../address/address";
import { CreateAddress, CreateUser } from '../../models';
import { UserService } from '../../services/user/user.service';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  imports: [RouterModule,ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, Address, NzCollapseModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  constructor(private userService: UserService) { }

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    userName: this.fb.control('', [Validators.required], [this.userNameAsyncValidator]),
    email: this.fb.control('', [Validators.email, Validators.required]),
    password: this.fb.control('', [Validators.required]),
    confirm: this.fb.control('', [this.confirmValidator]),
    phone: this.fb.control('', [Validators.required, Validators.pattern(/^0[1-9]\d{7,8}$/)]),
    firstName: this.fb.control(''),
    lastName: this.fb.control('', [Validators.required]),
    address: this.fb.control<CreateAddress | null>(null, [Validators.required]),
  });

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
    // console.log('submit', this.validateForm.value);
    this.userService.registerUser(this.validateForm.value as CreateUser).subscribe({
      next: (user) => {
        console.log('User registered successfully:', user);
      }
    });
    this.resetForm(new MouseEvent('click'));

  }

  addAddress(newAddress: CreateAddress): void {
    console.log("newAddress", newAddress);
    this.validateForm.controls.address.setValue(newAddress);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  userNameAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
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
