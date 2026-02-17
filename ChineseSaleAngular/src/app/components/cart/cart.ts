import { Component, OnDestroy, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

import { GlobalService } from '../../services/global/global.service';
import { CardCartService } from '../../services/card-cart/card-cart.service';
import { GiftService } from '../../services/gift/gift.service';
import { CardCart } from '../../models';
import { PackageService } from '../../services/package/package.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzButtonModule,
    NzIconModule,
    NzEmptyModule,
    NzAvatarModule,
    NzProgressModule,
    NzCardModule,
    NzDividerModule,
    NzSpaceModule,
    NzSegmentedModule,
    NzBadgeModule,
    NzStatisticModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit, OnDestroy {
  initLoading: boolean = false;
  private connectedSubscription?: Subscription;
  cardCart = computed(() => this.giftService.userCart());  activeTab: 'packages' | 'gifts' = 'packages';  packageCart = computed(() => this.packageService.userCart());

  constructor(
    private cartService: CardCartService,
    public global: GlobalService,
    public giftService: GiftService,
    public packageService: PackageService,  
    private router: Router 
  ) { }

  ngOnInit() {
    this.giftService.userId.set(this.giftService.getUserId());
    this.connectedSubscription = this.global.connected$.subscribe(() => {
      this.giftService.userId.set(this.giftService.getUserId());
    });

    const userId = this.global.user()?.id || null;
    if (userId) {
      this.initLoading = true;
      setTimeout(() => {
        this.initLoading = false;
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.connectedSubscription?.unsubscribe();
  }
  
  getTotal(): number {
    return this.cardCart().reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }

  getTotalTickets(): number {
    return this.cardCart().reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
  }

  getProgressPercent(): number {
    const total = this.getTotalTickets();
    return Math.min((total / 10) * 100, 100);
  }
}
