import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, output } from '@angular/core';
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
import { CreateAddress } from '../../models';

@Component({
  selector: 'app-address',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule],
  templateUrl: './address.html',
  styleUrl: './address.scss',
})
export class Address {
  
  @Output() addressChanged = new EventEmitter<CreateAddress>();
  
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    city: this.fb.control('', [Validators.required]),
    street: this.fb.control('', [Validators.required]),
    number: this.fb.control<number | null>(null, Validators.min(1)),
    zipCode: this.fb.control<number | null>(null, [Validators.min(1000000), Validators.max(9999999)]),
  });

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


}
