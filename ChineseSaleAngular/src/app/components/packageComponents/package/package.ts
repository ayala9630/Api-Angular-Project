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
    public packageService: PackageService,
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
  // currentLotteryId = signal(0);
  token: string = '';
  isLogin = false;

  ngOnInit() {
    // this.currentLotteryId.set(this.global.currentLottery()?.id || 0);
    // this.packageCart = JSON.parse(this.cookieService.get('packageCartUser1') || '[]');
    this.token = this.cookieService.get('auth_token') || '';
    // this.admin = getClaim(this.token, 'IsAdmin') ==='true';
    console.log(this.admin);
    this.isLogin = this.token !== '';
    this.validateForm.patchValue({
      lotteryId: this.global.currentLotteryId()    });
    this.uploadData();
  }

  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();


  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    numOfCards: [0, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]],
    lotteryId: [0, [Validators.required]],
  });

  // packageData: CreatePackage = {
  //   name: '',
  //   description: '',
  //   numOfCards: 0,
  //   price: 0,
  //   LotteryId: 0,
  // }

  private lotteryEffect = effect(() => {
    // this.currentLotteryId.set(this.global.currentLottery()?.id || 0);
    const lottery = this.global.currentLottery();
    this.uploadData();
  });

  uploadData() {
    this.packageService.getPackagesByLotteryId(this.global.currentLotteryId()).subscribe({
      next: (packages) => {
        this.allPackages = packages;
        console.log(this.allPackages);
      },
      error: (err) => {
        if (err.status === 404) {
          this.global.msg.warning('לא נמצאו חבילות להגרלה זו');
          this.allPackages = [];
          return;
        }
        else if (err.status === 500) {
          this.global.msg.error('שגיאה בשרת בעת טעינת החבילות');
          return;
        }
        else {
          console.error('Failed to load packages', err);
          this.global.msg.error('נכשל בטעינת החבילות');
        }
      }
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

  showDeleteConfirm(packageId: number): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent: '<b style="color: red;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.packageService.deletePackage(packageId).subscribe({
          next: () => {
            this.uploadData();
          },
          error: (err) => {
            if (err.status === 404) {
              this.global.msg.warning('החבילה כבר נמחקה');
              this.uploadData();
              return;
            }
            else if (err.status === 500) {
              this.global.msg.error('שגיאה במחיקת החבילה');
              console.error('Failed to delete package', packageId, err);
            } 
          }
        });
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }
}


