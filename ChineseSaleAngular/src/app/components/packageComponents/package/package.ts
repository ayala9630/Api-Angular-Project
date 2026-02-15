import { Component, effect, signal } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PackageService } from '../../../services/package/package.service';
import { Package as PackageModel, CreatePackage, PackageCarts } from '../../../models';
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
import { GlobalService } from '../../../services/global/global.service';
import { CookieService } from 'ngx-cookie-service';
import { getClaim } from '../../../utils/token.util';
import { Router, RouterLink } from "@angular/router";


@Component({
  selector: 'app-package',
  imports: [NzAvatarModule, NzCardModule, NzIconModule, FormsModule, NzInputNumberModule, NzButtonModule, NzModalModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, RouterLink],
  templateUrl: './package.html',
  styleUrl: './package.scss',
})
export class Package {
  constructor(
    private packageService: PackageService,
    private modal: NzModalService,
    public global: GlobalService,
    private cookieService: CookieService,
    private router: Router
  ) { }

  allPackages: PackageModel[] = [];
  admin: boolean = true;
  value = 0;
  isVisible = false;
  isConfirmLoading = false;
  currentLotteryId = signal(0);
  packageCart: PackageCarts[] = [];
  token: string = '';
  isLogin = false;

  ngOnInit() {
    this.currentLotteryId.set(this.global.currentLottery()?.id || 0);
    this.packageCart = JSON.parse(this.cookieService.get('packageCartUser1') || '[]');
    this.token = this.cookieService.get('auth_token') || '';
    // this.admin = getClaim(this.token, 'IsAdmin') ==='true';
    console.log(this.admin);
    this.isLogin = this.token !== '';
    this.uploadData();
  }

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();

  private lotteryEffect = effect(() => {
    this.currentLotteryId.set(this.global.currentLottery()?.id || 0);
    const lottery = this.global.currentLottery();
    this.uploadData();
  });

  uploadData() {
    this.packageService.getPackagesByLotteryId(this.currentLotteryId()).subscribe((packages) => {
      this.allPackages = packages;
      console.log(this.allPackages);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  editPackage(packageId: number): void {
    console.log(packageId);
    this.router.navigate(['/packages/edit', packageId]);
  }
  // showModal2(): void {
  //   this.isVisible = true;
  // };  

  // handleOk(): void {
  //   this.packageData = {
  //     name: this.validateForm.value.name || '',
  //     description: this.validateForm.value.description || '',
  //     numOfCards: this.validateForm.value.numOfCards || 0,
  //     price: this.validateForm.value.price || 0,
  //     LotteryId: this.currentLotteryId(),
  //   }  
  //   this.resetForm(new MouseEvent('click'));
  //   this.isConfirmLoading = true;
  //   this.packageService.addPackage(this.packageData).subscribe((newPackageId: number) => {
  //     console.log('New package added with ID:', newPackageId);
  //     // Optionally, refresh the package list or perform other actions
  //     this.uploadData();
  //   });  
  //   this.isVisible = false;
  //   this.isConfirmLoading = false;
  // }  

  // handleCancel(): void {
  //   this.isVisible = false;
  // }  


  updatePackage(packageId: number, qty: number): void {
    const existingCartItem = this.packageCart.find(item => item.packageId === packageId);
    if (existingCartItem) {
      existingCartItem.quantity += qty;
      if (existingCartItem.quantity <= 0) {
        this.packageCart = this.packageCart.filter(item => item.packageId !== packageId);
      }
    }
    else if (qty > 0) {
      this.packageCart.push({ packageId: packageId, quantity: qty });
    }
    this.cookieService.set('packageCartUser1', JSON.stringify(this.packageCart), 7);
  }

  getPackageQuantity(packageId: number): number {
    const existingCartItem = this.packageCart.find(item => item.packageId === packageId);
    return existingCartItem ? existingCartItem.quantity : 0;
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


