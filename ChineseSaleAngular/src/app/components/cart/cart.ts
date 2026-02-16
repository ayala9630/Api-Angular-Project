import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzProgressModule } from 'ng-zorro-antd/progress';

import { GlobalService } from '../../services/global/global.service';
import { CardCartService } from '../../services/card-cart/card-cart.service';
import { GiftService } from '../../services/gift/gift.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NzButtonModule,
    NzIconModule,
    NzEmptyModule,
    NzAvatarModule,
    NzProgressModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  initLoading: boolean = false;

  constructor(
    private cartService: CardCartService,
    public global: GlobalService,
    private cookieService: CookieService,
    public giftService: GiftService,
    private router: Router 
  ) { }

  ngOnInit() {
    const userId: number | null = Number(this.cookieService.get('userId')) || null;
    if (userId) {
      this.initLoading = true;
      // Assuming giftService has a method to load cart
      setTimeout(() => {
        this.initLoading = false;
      }, 500);
    }
  }

  getTotal(): number {
    return this.giftService.cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
  }

  getTotalTickets(): number {
    return this.giftService.cart.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
  }

  getProgressPercent(): number {
    const total = this.getTotalTickets();
    return Math.min((total / 10) * 10, 10);
  }
}
