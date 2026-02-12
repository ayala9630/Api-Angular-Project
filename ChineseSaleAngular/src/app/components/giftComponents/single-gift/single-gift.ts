import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GiftService } from '../../../services/gift/gift.service';
import { Gift } from '../../../models/gift';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { CardCarts } from '../../../models';
import { GlobalService } from '../../../services/global/global.service';

@Component({
  selector: 'app-single-gift',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzPageHeaderModule,
    NzDescriptionsModule,
    NzStatisticModule,
    NzTagModule,
    NzBadgeModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule
  ],
  templateUrl: './single-gift.html',
  styleUrls: ['./single-gift.scss']
})
export class SingleGift implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private giftService: GiftService,
    private cookieService: CookieService,
    private global: GlobalService
  ) { }

  giftId: number = 0;
  gift?: Gift;
  cart: CardCarts[] = [];
  lotteryStarted: boolean = false;
  lotteryfinished: boolean = false;
  

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.giftId = id;
    this.giftService.getGiftById(id).subscribe((data: Gift) => {
      this.gift = data;
    });
    this.cart = this.cookieService.get('cardCartUser1') ? JSON.parse(this.cookieService.get('cardCartUser1')!) : [];
     this.lotteryfinished = (new Date(this.global.currentLottery()?.endDate|| new Date()).getTime() <= new Date().getTime());
    this.lotteryStarted = (new Date(this.global.currentLottery()?.startDate|| new Date()).getTime() <= new Date().getTime());
  }
  updateGift(giftId: number, qty: number): void {
    const existingCartItem = this.cart.find(item => item.giftId === giftId);
    if (existingCartItem) {
      existingCartItem.quantity += qty;
      if (existingCartItem.quantity <= 0) {
        this.cart = this.cart.filter(item => item.giftId !== giftId);
      }
    } else if (qty > 0) {
      this.cart.push({ giftId: giftId, quantity: qty });
    }
    this.cookieService.set('cardCartUser1', JSON.stringify(this.cart), 7);
  }

  getGiftQuantity(giftId: number): number {
    const cartItem = this.cart.find(item => item.giftId === giftId);
    return cartItem ? cartItem.quantity : 0;
  }
}
