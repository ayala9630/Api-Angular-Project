import { Component, effect, inject } from '@angular/core';
import { GiftService } from '../../services/gift/gift.service';
import { GlobalService } from '../../services/global/global.service';
import { CreateGift, Gift as GiftModel, GiftWithOldPurchase } from '../../models/gift';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CardCarts, PaginatedResult } from '../../models';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CookieService } from 'ngx-cookie-service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import {ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-gift',
  imports: [NzAvatarModule, NzCardModule, NzIconModule, NzButtonModule, NzFormModule, NzInputModule, NzModalModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gift.html',
  styleUrl: './gift.scss',
})

export class Gift {
  constructor(
    private giftService: GiftService,
    private global: GlobalService,
    private cookieService: CookieService) { }
  paginatedGifts: PaginatedResult<GiftWithOldPurchase[]> | null = null;
  allGifts: GiftWithOldPurchase[] = [];
  admin: boolean = false;
  currentLotteryId: number = 0;
  cart: CardCarts[] = [];
  isVisible = false;
  isConfirmLoading = false;
  private fb = inject(NonNullableFormBuilder)

  giftData: CreateGift = {
    name: '',
    description: '',
    price: 0,
    giftValue: 0,
    imageUrl: '',
    isPackageAble: false,
    donorId: 0,
    categoryId: 0,
    lotteryId: this.currentLotteryId,
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

  
  showModal2(): void {
    this.isVisible = true;
  };

  ngOnInit(): void {
    this.currentLotteryId = this.global.currentLotteryId();
    // this.cookieService.set('cardCart', [], 7);
    this.cart = this.cookieService.get('cardCartUser1') ? JSON.parse(this.cookieService.get('cardCartUser1')!) : [];
    this.uploadData()
  }
  
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  private lotteryEffect = effect(() => {
    this.currentLotteryId = this.global.currentLotteryId();
    this.uploadData();
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
  getGiftQuantityInCart(giftId: number): number {
    const cartItem = this.cart.find(item => item.giftId === giftId);
    return cartItem ? cartItem.quantity : 0;
  }
  
  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }


  handleOk(): void {
    this.giftData = {
      name: this.validateForm.value.name || '',
      description: this.validateForm.value.description || '',
      price: this.validateForm.value.price || 0,
      giftValue: this.validateForm.value.giftValue || 0,
      imageUrl: this.validateForm.value.imageUrl || '',
      isPackageAble: this.validateForm.value.isPackageAble || false,
      donorId: this.validateForm.value.donorId || 0,
      categoryId: this.validateForm.value.categoryId || 0,
      lotteryId: this.currentLotteryId,
    }
    this.resetForm(new MouseEvent('click'));
    this.isConfirmLoading = true;
    this.giftService.createGift(this.giftData).subscribe((newGift: GiftModel) => {
      this.uploadData();
      console.log(newGift);
    }); 
    this.isVisible = false;
    this.isConfirmLoading = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}