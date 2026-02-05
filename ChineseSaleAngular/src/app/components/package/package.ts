import { Component, effect, signal } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PackageService } from '../../services/package/package.service';
import { Package as PackageModel, CreatePackage } from '../../models';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { GlobalService } from '../../services/global/global.service';


@Component({
  selector: 'app-package',
  imports: [NzAvatarModule, NzCardModule, NzIconModule, FormsModule, NzInputNumberModule, NzButtonModule, NzModalModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule],
  templateUrl: './package.html',
  styleUrl: './package.scss',
})
export class Package {
  constructor(private packageService: PackageService, private modal: NzModalService, private global: GlobalService) { }

  allPackages: PackageModel[] = [];
  admin: boolean = true;
  value = 0;
  isVisible = false;
  isConfirmLoading = false;
  currentLotteryId = signal(0);

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();


  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    numOfCards: [0, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]],
    loterryId: [this.currentLotteryId(), [Validators.required]],
  });

  packageData: CreatePackage = {
    name: '',
    description: '',
    numOfCards: 0,
    price: 0,
    loterryId: this.currentLotteryId(),
  }

  uploadData() {
    this.packageService.getPackagesByLotteryId(this.currentLotteryId()).subscribe((packages) => {
      this.allPackages = packages;
    });
  }

  private lotteryEffect = effect(() => {
    this.currentLotteryId.set(this.global.currentLottery()?.id || 0);
    this.uploadData();
  });

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

  showModal2(): void {
    this.isVisible = true;
  };

  handleOk(): void {
    this.packageData = {
      name: this.validateForm.value.name || '',
      description: this.validateForm.value.description || '',
      numOfCards: this.validateForm.value.numOfCards || 0,
      price: this.validateForm.value.price || 0,
      loterryId: this.currentLotteryId(),
    }
    this.resetForm(new MouseEvent('click'));
    this.isConfirmLoading = true;
    this.packageService.addPackage(this.packageData).subscribe((newPackageId: number) => {
      this.uploadData();
    }); 
    this.isVisible = false;
    this.isConfirmLoading = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  ngOnInit() {
    // אפשר גם להשתמש ישירות עם Signal
    this.currentLotteryId.set(this.global.currentLotteryId() || 0);
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


