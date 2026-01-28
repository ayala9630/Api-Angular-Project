import { Component, signal, WritableSignal, inject, OnDestroy, OnInit } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PackageService } from '../../services/package/package.service';
import { Package as PackageModel, CreatePackage } from '../../models';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, Observer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { GlobalService } from '../../services/global/global.service';
@Component({
  selector: 'app-package',
  imports: [NzAvatarModule, NzCardModule, NzIconModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, FormsModule, NzInputNumberModule, NzButtonModule, NzButtonModule, NzModalModule],
  templateUrl: './package.html',
  styleUrl: './package.scss'
})
export class Package {
  constructor(private packageService: PackageService, private modal: NzModalService, private global: GlobalService) { }
  isVisible = false;
  currentLotteryId: number = 0;
  isConfirmLoading = false;
  allPackages: PackageModel[] = [];
  admin: boolean = true;
  newPackage: CreatePackage = {
    name: '',
    description: '',
    numOfCards: 0,
    price: 0,
    loterryId: this.currentLotteryId
  };
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    description: this.fb.control(''),
    numOfCards: this.fb.control(0, [Validators.required]),
    price: this.fb.control(0, [Validators.required]),
    loterryId: this.fb.control(this.currentLotteryId, [Validators.required]),
  });
  ngOnInit() {
    this.global.sharedData$.subscribe(data => {
      this.currentLotteryId = data?.id || 0;
      this.uploadData();
    });

  }
  uploadData() {
    this.packageService.getPackagesByLotteryId(this.currentLotteryId).subscribe((packages) => {
      this.allPackages = packages;
    });
  }

  value = 3;

  onChange(value: number): void {
    console.log(value);
  }
  showModal2(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isConfirmLoading = true;
    this.newPackage = {
      name: this.validateForm.value.name || "",
      description: this.validateForm.value.description,
      numOfCards: this.validateForm.value.numOfCards || 0,
      price: this.validateForm.value.price || 0,
      loterryId: this.currentLotteryId||0,
    };
    this.resetForm(new MouseEvent('click'));
    this.packageService.addPackage(this.newPackage).subscribe(() => {
      this.uploadData();
    });
    this.isVisible = false;
    this.isConfirmLoading = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    console.log('submit', this.validateForm.value);
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
  showDeleteConfirm(packageId: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.packageService.deletePackage(packageId).subscribe(() => {
          this.uploadData();
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }
}