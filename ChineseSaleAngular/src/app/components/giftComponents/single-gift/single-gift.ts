import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CardCart, CardCarts } from '../../../models';
import { GlobalService } from '../../../services/global/global.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GiftWithOldPurchase } from '../../../models/gift';
import { CartService } from '../../../services/cart/cart.service';

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
    public giftService: GiftService,
    private cookieService: CookieService,
    public global: GlobalService,
    private msg: NzMessageService,
    private router: Router,
    private cartService: CartService
  ) { }

  giftId: number = 0;
  gift?: Gift | undefined= undefined;
    

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.giftId = id;
    this.giftService.getGiftById(id).subscribe({
      next: (data) => {
        this.gift = data;
      },
      error: (err) => {
        if (err.status === 404) {
          this.msg.error('המתנה לא נמצאה');
          console.error('Gift not found:', err);
        }
        else if (err.status === 500) {
          this.msg.error('שגיאה בשרת, אנא נסה שוב מאוחר יותר');
          console.error('Server error:', err);
        }
        else {
          this.msg.error('שגיאה בטעינת המתנה');
          console.error('Error fetching gift:', err);
        }
        this.router.navigate(['/gifts']);
      }
    });
  }
    updateQuantity(gift: Gift | undefined, change: number): void {
      if (!this.global.lotteryStarted() || this.global.lotteryFinished() || !gift) {
        return;
      }
      const item: CardCart = {
        giftId: gift.id,
        quantity: change,
        userId: this.global.user()?.id || 0,
        giftName: gift.name,
        imageUrl: gift.imageUrl,
        price: gift.price || 0,
        isPackageAble: gift.isPackageAble
      };
      this.cartService.availableCards += (gift.isPackageAble ? -change : 0);
      this.giftService.updateCardQuantity(item, change);
    }
}