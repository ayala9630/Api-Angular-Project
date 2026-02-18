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
import { NzModalService } from 'ng-zorro-antd/modal';

import { GlobalService } from '../../services/global/global.service';
import { CardCartService } from '../../services/card-cart/card-cart.service';
import { GiftService } from '../../services/gift/gift.service';
import { CardCart, CreateCard, CreateCardCart, PackageCart } from '../../models';
import { PackageService } from '../../services/package/package.service';
import { CartService } from '../../services/cart/cart.service';
import { CardService } from '../../services/card/card.service';

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
  cardCart = computed(() => this.giftService.userCart()); activeTab: 'packages' | 'gifts' = 'packages'; packageCart = computed(() => this.packageService.userCart());

  constructor(
    private cardService: CardService,
    public global: GlobalService,
    public giftService: GiftService,
    public packageService: PackageService,
    private router: Router,
    public cartService: CartService,
    private modal: NzModalService,
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
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
  }

  getTotalTickets(): number {
    return this.cardCart().reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      return sum + quantity;
    }, 0);
  }

  getProgressPercent(): number {
    const total = this.getTotalTickets();
    return Math.min((total / this.cartService.availableCards) * 100, 100);
  }
  updateCardQuantity(item: CardCart, change: number): void {
    if (change <= 0 && !item.isPackageAble) {
      this.giftService.updateCardQuantity(item, change);
      return;
    }
    else if (this.cartService.availableCards <= 0) {
      this.global.msg.error('הוסף חבילה לפני רכישת כרטיסים');
      return;
    }
    else if (this.cartService.availableCards < this.getTotalTickets() + change) {
      this.global.msg.error('לא ניתן להוסיף כרטיסים נוספים, כמות הכרטיסים הזמינה נגמרה');
      return;
    }
    this.giftService.updateCardQuantity(item, change);
    this.getProgressPercent();
  }
  updatePackageQuantity(card: PackageCart, qty: number): void {
    console.log(card.numberOfCards);
    
    if(qty===-1 && card.quantity > 1) {
      this.cartService.availableCards = this.cartService.availableCards - card.numberOfCards/2;
    }
    else if (qty <= 0) {
      this.cartService.availableCards -= (card.numberOfCards * (card.quantity - 1));
    }
    this.cartService.availableCards += (card.numberOfCards * qty);
    this.packageService.updatePackageQuantity(card, qty);
  }

  // פונקציה לפתיחת מודל תשלום
  openPaymentModal(): void {
    const total = this.getTotal();
    this.modal.create({
      nzTitle: 'סיכום תשלום',
      nzContent: `
        <div style="text-align:center;">
          <h2>הסכום לתשלום: ₪${total}</h2>
          <button nz-button nzType="primary" id="payBtn">תשלום</button>
        </div>
      `,
      nzFooter: null,
      nzBodyStyle: { 'text-align': 'center' },
      nzOnOk: () => {}
    });

    // מאזין לכפתור תשלום (כי nzContent הוא HTML)
    setTimeout(() => {
      const btn = document.getElementById('payBtn');
      if (btn) {
        btn.onclick = () => {
          this.pay();
          this.modal.closeAll();
        };
      }
    }, 100);
  }

  // פונקציית תשלום
  pay(): void {
    // כאן תבצע את ההזמנה בפונקציה שמזמינה את הכרטיסים ב-card
    for(let card of this.cardCart()) {
    const cart: CreateCard={
      userId: this.global.user()?.id || 0,
      giftId: card.giftId,
    }
      this.cardService.createCard(cart).subscribe({
        next: () => {
          // this.global.msg.success('הכרטיסים נקנו בהצלחה!')
          this.global.msg.success('התשלום בוצע בהצלחה!');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Failed to create card cart', err);
          this.global.msg.error('שגיאה ביצירת הכרטיסים');
        }
      });
      // אפשר להוסיף הודעה/הפניה
    }
  }
}