import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, output } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, Observer, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { UserService } from '../../services/user/user.service';
import { CreateAddress } from '../../models';
@Component({
  selector: 'app-address',
  imports: [NzFormModule, NzInputModule, NzButtonModule, ReactiveFormsModule],
  templateUrl: './address.html',
  styleUrl: './address.scss',
})
export class Address {

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    city: this.fb.control('', [Validators.required]),
    street: this.fb.control('', [Validators.required]),
    number: this.fb.control<number | null>(null, [Validators.min(1)]),
    zipCode: this.fb.control<number | null>(null, [Validators.min(1000000), Validators.max(9999999)]),
  });
  addr: CreateAddress = {
    city: this.validateForm.value.city!,
    street: this.validateForm.value.street!,
    number: this.validateForm.value.number!,
    zipCode: this.validateForm.value.zipCode!,
  }
  @Output() addressChanged = new EventEmitter<CreateAddress>();
  ngOnInit(): void {
    this.validateForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (this.validateForm.valid) {
        this.addressChanged.emit(this.validateForm.value as CreateAddress);
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
