import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global/global.service';
import { CardService } from '../../../services/card/card.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../../models';
import { NzListItemMetaComponent, NzListItemMetaTitleComponent, NzListItemMetaDescriptionComponent, NzListComponent, NzListItemComponent } from "ng-zorro-antd/list";
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-single-gift-purchases',
  imports: [NzCardModule, NzListItemMetaComponent, NzListItemMetaTitleComponent, NzListItemMetaDescriptionComponent, NzListComponent, NzListItemComponent],
  templateUrl: './single-gift-purchases.html',
  styleUrl: './single-gift-purchases.scss',
})
export class SingleGiftPurchases {
  constructor(
    private cardService: CardService,
    public global: GlobalService,
    public route: ActivatedRoute,
    private router: Router
  ) { }

  gift: Card | null = null;
  giftId: number = 0;
  initLoading = true;
  allPurchases: { userName: string; quantity: number }[] = [];

  get totalTickets(): number {
    return this.allPurchases.reduce((total, item) => total + item.quantity, 0);
  }

  ngOnInit() {
    this.giftId = Number(this.route.snapshot.paramMap.get('id'));
    this.uploadData();
  }

  uploadData() {
    if (this.giftId) {
      this.cardService.getCardByGiftId(this.giftId).subscribe({
        next: (res) => {
          this.gift = res;
          this.allPurchases = Object.entries(this.gift.cardPurchases ?? {}).map(
            ([userName, quantity]) => ({ userName, quantity })
          );
          this.initLoading = false;
          console.log(res);
        },
        error: (err) => {
          if (err.status === 404) {
            this.global.msg.error("לא נמצאו הזמנות למתנה זו");
            this.initLoading = false;
          }
            else if (err.status === 401) {
              this.global.msg.error("נא להתחבר כדי לצפות בהזמנות");
              this.initLoading = false;
              this.router.navigate(['/login']);
            }
          else if (err.status === 500)
            this.global.msg.error("שגיאת שרת נסה שוב מאוחר יותר")
          else this.global.msg.error("שגיאה בטעינת המתנה")
        },
      });
    } else {
      this.global.msg.error("לא נבחרה מתנה");
      this.initLoading = false;
    }
  }
}