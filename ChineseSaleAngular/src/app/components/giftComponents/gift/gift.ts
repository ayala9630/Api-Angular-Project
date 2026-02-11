import { Component, effect, inject, SimpleChanges } from '@angular/core';
import { GiftService } from '../../../services/gift/gift.service';
import { GlobalService } from '../../../services/global/global.service';
import { Gift as GiftModel, GiftWithOldPurchase } from '../../../models/gift';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CardCarts, PaginatedResult } from '../../../models';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CookieService } from 'ngx-cookie-service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from "@angular/router";
// import { getClaim } from 'src/app/utils/token.util';
@Component({
  selector: 'app-gift',
  imports: [NzAvatarModule, NzCardModule, NzIconModule, NzButtonModule, RouterLink, RouterOutlet],
  templateUrl: './gift.html',
  styleUrl: './gift.scss',
})


export class Gift {
  constructor(
    private giftService: GiftService,
    private global: GlobalService,
    private cookieService: CookieService
  ) { }

  paginatedGifts: PaginatedResult<GiftWithOldPurchase[]> | null = null;
  allGifts: GiftWithOldPurchase[] = [];
  admin: boolean = false;
  currentLotteryId: number = 0;
  cart: CardCarts[] = [];
  isVisible:boolean = false;
  lotteryStarted: boolean = false;
  lotteryfinished: boolean = false;
  
  private fb = inject(NonNullableFormBuilder)


  ngOnInit(): void {
    this.currentLotteryId = this.global.currentLotteryId();
    const token = this.cookieService.get('authToken') || '';
    // const userId = getClaim(token, 'sub') || getClaim(token, 'userId');
    // this.cookieService.set('cardCart', [], 7);
    this.cart = this.cookieService.get('cardCartUser1') ? JSON.parse(this.cookieService.get('cardCartUser1')!) : [];
    this.uploadData()
    
  }

  
  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    giftValue: [0, [Validators.required, Validators.min(0)]],
    imageUrl: [''],
    isPackageAble: [false],
    donorId: [0, [Validators.required, Validators.min(1)]],
    categoryId: [0, [Validators.min(1)]],
    lotteryId: [this.currentLotteryId, [Validators.required]],
  });

  
  uploadData(): void {
    this.giftService.getGifts(this.currentLotteryId).subscribe((gifts) => {
      console.log(gifts);
      this.paginatedGifts = gifts;
      this.allGifts = this.paginatedGifts.items.flat();
    });
  }
  
  edit() {
    this.validateForm.patchValue({
      name: this.validateForm.value.name,
      description: this.validateForm.value.description,
      price: this.validateForm.value.price,
      giftValue: this.validateForm.value.giftValue,
      imageUrl: this.validateForm.value.imageUrl,
      isPackageAble: this.validateForm.value.isPackageAble,
      donorId: this.validateForm.value.donorId,
      categoryId: this.validateForm.value.categoryId,
      lotteryId: this.currentLotteryId,
    });

  }

  private lotteryEffect = effect(() => {
    this.currentLotteryId = this.global.currentLotteryId();
    this.uploadData();
    
    if (this.global.currentLottery() != null) {
       console.log("lottery effect", this.global.currentLottery());
      //  console.log(new Date(this.global.currentLottery()?.endDate || new Date()));
      //  console.log(new Date(this.global.currentLottery()?.startDate || new Date()));
       
      this.lotteryfinished = (new Date(this.global.currentLottery()?.endDate|| new Date()).getTime() <= new Date().getTime());
      this.lotteryStarted = (new Date(this.global.currentLottery()?.startDate|| new Date()).getTime() <= new Date().getTime());
    }
    console.log("started", this.lotteryStarted, "finished", this.lotteryfinished);  
  });
  
  
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

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }


  ngOnChanges(c: SimpleChanges): void {
    this.currentLotteryId = this.global.currentLotteryId();
    this.uploadData();
  
    // this.validateForm = new FormGroup({
    //   name: this.fb.group(['', [Validators.required]]),
    //   description:this.fb.group( ['']),
    //   price: this.fb.group([0, [Validators.required, Validators.min(0)]]),
    //   giftValue: this.fb.group([0, [Validators.required, Validators.min(0)]]),
    //   imageUrl: this.fb.group(['']),
    //   isPackageAble: this.fb.group([false]),
    //   donorId: this.fb.group([0, [Validators.required, Validators.min(1)]]),
    //   categoryId: this.fb.group([0, [Validators.min(1)]]),
    //   lotteryId: this.fb.group([this.currentLotteryId, [Validators.required]]),
    // });
  }


}
