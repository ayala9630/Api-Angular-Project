import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, Observer, Subject } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { DonorService } from '../../../services/donor/donor.service';
import { CreateAddress, CreateDonor, UpdateDonor } from '../../../models';
import { Address } from '../../address/address';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../services/global/global.service';
import { Donor } from '../../../models';

@Component({
  selector: 'app-post-donor',
  imports: [ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, NzCollapseModule, Address],
  templateUrl: './post-donor.html',
  styleUrl: './post-donor.scss',
})
export class PostDonor {
  constructor(private donorServise: DonorService,
    private msg: NzMessageService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private global: GlobalService) { }
  private fb = inject(NonNullableFormBuilder)
  private destroy$ = new Subject<void>();
  newDonor: CreateDonor | null = null;
  titel: string = '';
  id: number | null = null;
  addressId :number | null = null;
  currentDonor: UpdateDonor | null = null;
  validateForm = this.fb.group({
    firstName: this.fb.control(''),
    companyEmail: this.fb.control('', [Validators.email, Validators.required]),
    lastName: this.fb.control(''),
    companyName: this.fb.control('', [Validators.required]),
    companyPhone: this.fb.control('', [Validators.pattern(/^0[1-9]\d{7,8}$/)]),
    companyIcon: this.fb.control(''),
    companyAddress: this.fb.control<CreateAddress | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => this.id = params['id']);
    console.log(this.id);
    if (!this.id)
      this.titel = "הוספת תורם"
    else {
      this.titel = "עריכת תורם"
      this.donorServise.getDonorByIdSimple(this.id, this.global.currentLotteryId()).subscribe({
        next: (donor) => {
          this.addressId = donor.companyAddressId;
          this.currentDonor = donor;
          this.validateForm.patchValue({
            firstName: donor.firstName,
            lastName: donor.lastName,
            companyEmail: donor.companyEmail,
            companyName: donor.companyName,
            companyIcon: donor.companyIcon,
            companyPhone: donor.companyPhone,
          })
        },
        error: (error) => {
          this.msg.error('תורם לא קיים')
          this.router.navigateByUrl('donors')
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (!this.id) {
      this.donorServise.addDonor(this.validateForm.value as CreateDonor).subscribe({
        next: () => {
          this.msg.success('תורם נוצר בהצלחה');
          this.router.navigate(['/donors'], { queryParams: { reopenAddModal: true } });
        },
        error: (error) => {
          this.msg.error('Error creating donor: ' + error.message);
        }
      });
    } else {
      const updatePayload: UpdateDonor = {
        ...(this.validateForm.value as UpdateDonor),
        id: this.id
      };

      this.donorServise.updateDonor(updatePayload).subscribe({
        next: () => {
          this.msg.success('פרטי התורם התעדכנו בהצלחה');
          this.router.navigateByUrl('/donors');
        },
        error: () => {
          this.msg.error('שגיאה בעדכון התורם');
        }
      });
    }
  }

  addAddress(newAddress: CreateAddress): void {
    this.validateForm.controls.companyAddress.setValue(newAddress);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  userNameAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
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
