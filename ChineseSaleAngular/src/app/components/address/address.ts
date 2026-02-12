import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CreateAddress } from '../../models';
import { AddressService } from '../../services/address/AddressService';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule],
  templateUrl: './address.html',
  styleUrls: ['./address.scss'],
})
export class Address implements OnInit, OnDestroy, OnChanges {

  @Input() addressId: number | null = null;
  @Output() addressChanged = new EventEmitter<CreateAddress>();

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  constructor(private addressService: AddressService) {}

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

    if (this.addressId) {
      this.loadAddress(this.addressId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['addressId'] && changes['addressId'].currentValue) {
      this.loadAddress(changes['addressId'].currentValue);
    }
  }

  private loadAddress(id: number): void {
    this.addressService.getAddressById(id).subscribe({
      next: (address) => {
        this.validateForm.patchValue({
          city: address.city,
          street: address.street,
          number: address.number ?? null,
          zipCode: address.zipCode ?? null
        });

        this.addressChanged.emit(this.validateForm.value as CreateAddress);
      },
      error: (err) => {
        console.error('Failed to load address', id, err);
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
