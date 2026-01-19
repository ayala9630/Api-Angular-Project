import { Component, signal, WritableSignal } from '@angular/core';
import { GiftService } from '../../services/gift.service';
import { GiftWithOldPurchase } from '../../models';

@Component({
  selector: 'app-gift',
  imports: [],
  templateUrl: './gift.html',
  styleUrl: './gift.scss',
})
export class Gift {
  constructor(private giftService: GiftService) { }

  allGifts: WritableSignal<GiftWithOldPurchase[][]> = signal([]);

  async ngOnInit() {
    await this.giftService.getGifts().subscribe((gifts) => {
      this.allGifts.set(gifts.items);
      console.log(gifts.items[0][0]);
    });
    console.log(this.allGifts());
  }
}

